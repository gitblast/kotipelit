/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import supertest from 'supertest';

import jwt from 'jsonwebtoken';
import app from '../app';
import config from '../utils/config';
import Game from '../models/game';
import dbConnection from '../utils/connection';
import testHelpers from '../utils/testHelpers';
import mailService from '../services/mail';
import {
  NewGame,
  GameStatus,
  UserModel,
  Role,
  GameType,
  GamePlayer,
  GameModel,
} from '../types';
import Word from '../models/word';
import Url from '../models/url';
import User from '../models/user';

jest.mock('../services/mail', () => ({ sendInvite: jest.fn() }));

const mailerMock = mailService.sendInvite as jest.Mock;

mailerMock.mockResolvedValue({});

const api = supertest(app);

const baseUrl = '/api/games';

const dummyGame: Omit<NewGame, 'host'> = {
  type: GameType.KOTITONNI,
  price: 10,
  players: [
    {
      id: 'id1',
      name: 'player1',
      points: 0,
      inviteCode: 'player1invite',
      reservedFor: null,
      data: {
        answers: {},
        words: [],
      },
    },
    {
      id: 'id2',
      name: 'player2',
      points: 0,
      data: {
        answers: {},
        words: [],
      },
      inviteCode: 'player2invite',
      reservedFor: null,
    },
  ],
  startTime: new Date(),
  status: GameStatus.UPCOMING,
  rounds: 3,
};

let user: UserModel;
let token: string;
let game: GameModel;
let gameId: string;

describe('games router', () => {
  beforeEach(async () => {
    await Game.deleteMany({});
    await Url.deleteMany({});
    await User.deleteMany({});

    user = await testHelpers.addDummyUser();
    token = testHelpers.getValidToken(user, config.SECRET, Role.HOST);

    game = await testHelpers.addDummyGame(user);
    gameId = game._id.toString();
  });

  it('should return 401 without valid token on protected routes', async () => {
    await api.post(baseUrl).send(dummyGame).expect(401);
    await api.get(baseUrl).expect(401);
    await api.delete(`${baseUrl}/id`).expect(401);
    await api.get(`${baseUrl}/words/1`).expect(401);

    const invalidToken = testHelpers.getValidToken(
      user,
      config.SECRET,
      Role.PLAYER
    );

    await api
      .post(baseUrl)
      .set('Authorization', `bearer ${invalidToken}`)
      .send(dummyGame)
      .expect(401);
    await api
      .get(baseUrl)
      .set('Authorization', `bearer ${invalidToken}`)
      .expect(401);
    await api
      .delete(`${baseUrl}/id`)
      .set('Authorization', `bearer ${invalidToken}`)
      .expect(401);
    await api
      .get(`${baseUrl}/words/1`)
      .set('Authorization', `bearer ${invalidToken}`)
      .expect(401);
  });

  describe('GET /lobby/:hostName/:gameId', () => {
    it('should throw error if no game is found or if status is not upcoming', async () => {
      const hostName = user.username;

      expect(game.status).toBe(GameStatus.UPCOMING);

      await api.get(`${baseUrl}/lobby/${hostName}/invalidID`).expect(400);

      game.status = GameStatus.WAITING;

      await game.save();

      await api.get(`${baseUrl}/lobby/${hostName}/${gameId}`).expect(400);
    });

    it('should throw error if host not found or not matching game host', async () => {
      await api.get(`${baseUrl}/lobby/INVALID_FOR_TESTS/${gameId}`).expect(400);

      const newUser = await testHelpers.addDummyUser('DIFFERENT USERNAME');

      await api
        .get(`${baseUrl}/lobby/${newUser.username}/${gameId}`)
        .expect(400);
    });

    it('should return game type, price, hostname and starttime and locked player names if no errors', async () => {
      game.players = game.players.map((player, index) => {
        return index === 0
          ? {
              ...player,
              reservedFor: {
                id: 'reservation id',
                expires: Date.now() * 2,
                locked: true, // set one player reserved for to be locked
              },
            }
          : player;
      });

      await game.save();

      const response = await api
        .get(`${baseUrl}/lobby/${user.username}/${gameId}`)
        .expect(200);

      expect(response.body.type).toBe(game.type);
      expect(response.body.price).toBe(game.price);
      expect(response.body.hostName).toBe(user.username);
      expect(new Date(response.body.startTime)).toEqual(game.startTime);

      response.body.players?.forEach(
        (
          player: {
            name: string;
            id: string;
            reservedFor: {
              expires: number;
              locked: boolean;
            };
          },
          index: number
        ) => {
          if (index === 0) {
            expect(player.name).toBe(game.players[0].name);
            expect(player.id).toBe(game.players[0].id);
            expect(player.reservedFor?.expires).toBe(
              game.players[0].reservedFor?.expires
            );
            expect(player.reservedFor.locked).toBe(
              game.players[0].reservedFor?.locked
            );
          } else {
            expect(player.reservedFor).toBeNull();
          }
        }
      );
    });
  });

  describe('PUT /lock', () => {
    let lockReqBody: {
      gameId: string;
      reservationId: string;
      displayName: string;
      email: string;
    };

    beforeEach(() => {
      lockReqBody = {
        gameId,
        reservationId: 'INVALID_reservation',
        displayName: 'TestDisplayName',
        email: 'testEmailAddress@validish.io',
      };
    });

    it('should throw error if no game found', async () => {
      await api
        .put(`${baseUrl}/lock`)
        .send({
          gameId: 'INVALID',
          reservationId: 'reservation',
        })
        .expect(400);
    });

    it('should throw error if no reservation found', async () => {
      await api.put(`${baseUrl}/lock`).send(lockReqBody).expect(400);
    });

    it('should throw error if reservation has expired', async () => {
      const reservation = {
        id: lockReqBody.reservationId,
        expires: Date.now() - 100000, // expired
        locked: false,
      };

      game.players = game.players.map((player, index) => {
        return index === 0
          ? {
              ...player,
              reservedFor: reservation,
            }
          : player;
      });

      await game.save();

      await api.put(`${baseUrl}/lock`).send(lockReqBody).expect(400);
    });

    it('should throw error if reservation is locked', async () => {
      const reservation = {
        id: lockReqBody.reservationId,
        expires: Date.now() * 2, // valid
        locked: true,
      };

      game.players = game.players.map((player, index) => {
        return index === 0
          ? {
              ...player,
              reservedFor: reservation,
            }
          : player;
      });

      await game.save();

      await api.put(`${baseUrl}/lock`).send(lockReqBody).expect(400);
    });

    it('should lock reservation if everything is ok', async () => {
      const reservation = {
        id: lockReqBody.reservationId,
        expires: Date.now() * 2, // valid
        locked: false,
      };

      game.players = game.players.map((player, index) => {
        return index === 0
          ? {
              ...player,
              reservedFor: reservation,
            }
          : player;
      });

      await game.save();

      const response = await api
        .put(`${baseUrl}/lock`)
        .send(lockReqBody)
        .expect(200);

      expect(response.body.reservedFor?.id).toBe(lockReqBody.reservationId);
      expect(response.body.reservedFor?.locked).toBe(true);
      expect(response.body.name).toBe(lockReqBody.displayName);
      expect(mailerMock).toHaveBeenLastCalledWith(
        lockReqBody.email,
        expect.any(Object)
      );
    });
  });

  describe('PUT /reserve ', () => {
    it('should set reservation if available slots exist', async () => {
      const reservations = game.players.map((p) =>
        p.reservedFor ? p.reservedFor.id : null
      );

      const reqBody = {
        gameId,
        reservationId: 'TEST_ID',
      };

      expect(reservations.indexOf(reqBody.reservationId)).toBe(-1);

      await api.put(`${baseUrl}/reserve`).send(reqBody).expect(200);

      const gameNow = await Game.findById(gameId);

      const reservationsNow = gameNow?.players.map((player: GamePlayer) =>
        player.reservedFor ? player.reservedFor.id : null
      );

      expect(reservationsNow?.indexOf(reqBody.reservationId)).not.toBe(-1);
    });

    it('should set reservation if expired, non locked reservation slots exist', async () => {
      game.players = game.players.map((player, index) => ({
        ...player,
        reservedFor: {
          id: `reservation ${index}`,
          expires: Date.now() - 1000,
          locked: index !== 0,
        },
      }));

      await game.save();

      const reservations = game.players.map((p) =>
        p.reservedFor ? p.reservedFor.id : null
      );

      const reqBody = {
        gameId,
        reservationId: 'TEST_ID',
      };

      expect(reservations.indexOf(null)).toBe(-1);
      expect(reservations.indexOf(reqBody.reservationId)).toBe(-1);

      await api.put(`${baseUrl}/reserve`).send(reqBody).expect(200);

      const gameNow = await Game.findById(gameId);

      const reservationsNow = gameNow?.players.map((p: GamePlayer) =>
        p.reservedFor ? p.reservedFor.id : null
      );

      expect(reservationsNow?.indexOf(null)).toBe(-1);
      expect(reservationsNow?.indexOf(reqBody.reservationId)).not.toBe(-1);
    });

    it('should throw 400 if reservation fails', async () => {
      game.players = game.players.map((player, index) => ({
        ...player,
        reservedFor: {
          id: `reservation ${index}`,
          expires: Date.now() * 2,
        },
      }));

      await game.save();

      const reservations = game.players.map((p) =>
        p.reservedFor ? p.reservedFor.id : null
      );

      const reqBody = {
        gameId,
        reservationId: 'TEST_ID',
      };

      expect(reservations.indexOf(null)).toBe(-1);
      expect(reservations.indexOf(reqBody.reservationId)).toBe(-1);

      await api.put(`${baseUrl}/reserve`).send(reqBody).expect(400);

      const gameNow = await Game.findById(gameId);

      const reservationsNow = gameNow?.players.map((p) =>
        p.reservedFor ? p.reservedFor.id : null
      );

      expect(reservationsNow?.indexOf(null)).toBe(-1);
      expect(reservationsNow?.indexOf(reqBody.reservationId)).toBe(-1);
    });
  });

  describe('GET /join/:hostName/:inviteCode', () => {
    it('should return token with valid parameters', async () => {
      const player = game.players[0];

      const hostName = user.username;

      if (!player.inviteCode) {
        throw new Error('Player inviteCode was not set, check helper');
      }

      const response = await api
        .get(`${baseUrl}/join/${hostName}/${player.inviteCode}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const expectedPayload = {
        exp: expect.any(Number),
        username: player.name,
        id: player.id,
        gameId: gameId,
        type: 'rtc',
        role: Role.PLAYER,
      };

      const decodedToken = jwt.verify(response.body, config.SECRET) as Record<
        string,
        string
      >;

      // remove iat field
      delete decodedToken.iat;

      expect(decodedToken).toEqual(expectedPayload);
    });

    it('should return 400 with invalid host name or player id', async () => {
      await api
        .get(`${baseUrl}/join/${user.username}/INCORRECT_ID`)
        .expect(400);

      await api
        .get(`${baseUrl}/join/INVALID_HOST/${game.players[0].id}`)
        .expect(400);
    });
  });

  describe('GET /', () => {
    it('should return only games added by host matching with token', async () => {
      const anotherUser = await testHelpers.addDummyUser();

      const initialGames = await testHelpers.gamesInDb();

      await testHelpers.addDummyGame(anotherUser);
      await testHelpers.addDummyGame(anotherUser);
      await testHelpers.addDummyGame(user);
      await testHelpers.addDummyGame(user);

      const gamesAtEnd = await testHelpers.gamesInDb();

      expect(gamesAtEnd.length).toBe(initialGames.length + 4);

      const response = await api
        .get(baseUrl)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(initialGames.length + 2);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.body.forEach((game: any) => {
        expect(game.host).toBeDefined();
        expect(game.host).toBe(user._id.toString());
      });
    });
  });

  describe('POST /', () => {
    it('should add a valid game with valid token', async () => {
      const initialGames = await testHelpers.gamesInDb();

      const newGame = {
        ...dummyGame,
      };

      const response = await api
        .post(baseUrl)
        .send(newGame)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const gamesAtEnd = await testHelpers.gamesInDb();

      expect(gamesAtEnd.length).toBe(initialGames.length + 1);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('createDate');
      expect(response.body).toHaveProperty('id');
    });

    it('should add token id as host id when adding new game', async () => {
      const id = user._id;

      const response = await api
        .post(baseUrl)
        .send(dummyGame)
        .set('Authorization', `bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('host');
      expect(response.body.host).toBe(id.toString());
    });

    it('should return 400 with invalid game object using valid token', async () => {
      await api
        .post(baseUrl)
        .send({ ...dummyGame, players: undefined })
        .set('Authorization', `bearer ${token}`)
        .expect(400);
      await api
        .post(baseUrl)
        .send({ ...dummyGame, type: undefined })
        .set('Authorization', `bearer ${token}`)
        .expect(400);
      await api
        .post(baseUrl)
        .send({ ...dummyGame, startTime: undefined })
        .set('Authorization', `bearer ${token}`)
        .expect(400);
    });
  });

  describe('DELETE /:id', () => {
    it('should allow deleting games added by id matching token', async () => {
      const initialGames = await testHelpers.gamesInDb();

      const newGame = await testHelpers.addDummyGame(user);

      const tempGames = await testHelpers.gamesInDb();

      expect(tempGames.length).toBe(initialGames.length + 1);

      const newGameId: string = newGame._id.toString();

      await api
        .delete(`${baseUrl}/${newGameId}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204);

      const gamesAfterDelete = await testHelpers.gamesInDb();

      expect(gamesAfterDelete.length).toBe(tempGames.length - 1);
    });

    it('should not allow deleting games added by others', async () => {
      const anotherUser = await testHelpers.addDummyUser();

      const anotherGame = await testHelpers.addDummyGame(anotherUser);
      const anotherId: string = anotherGame._id.toString();

      const gamesAfterAdd = await testHelpers.gamesInDb();

      await api
        .delete(`${baseUrl}/${anotherId}`)
        .set('Authorization', `bearer ${token}`)
        .expect(400);

      const gamesAfterDelete = await testHelpers.gamesInDb();

      expect(gamesAfterDelete).toEqual(gamesAfterAdd);
    });
  });

  describe('GET /words/:amount', () => {
    const sample = ['word1', 'word2', 'word3', 'word4', 'word5'];

    beforeEach(async () => {
      await Word.deleteMany({});
      await testHelpers.addDummyWords(sample);
    });

    it('should start testing with 5 words in db', async () => {
      const wordsInDb = await Word.find({});

      expect(wordsInDb.length).toBe(5);
    });

    it('should return 400 with non positive or non integer param', async () => {
      await api
        .get(`${baseUrl}/words/0`)
        .set('Authorization', `bearer ${token}`)
        .expect(400);
      await api
        .get(`${baseUrl}/words/1.1`)
        .set('Authorization', `bearer ${token}`)
        .expect(400);
      await api
        .get(`${baseUrl}/words/-1`)
        .set('Authorization', `bearer ${token}`)
        .expect(400);
    });

    it('should return an array of words with length given as parameter', async () => {
      const response1 = await api
        .get(`${baseUrl}/words/1`)
        .set('Authorization', `bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response1.body)).toBe(true);
      expect(response1.body.length).toBe(1);

      const response2 = await api
        .get(`${baseUrl}/words/3`)
        .set('Authorization', `bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response2.body)).toBe(true);
      expect(response2.body.length).toBe(3);

      const response3 = await api
        .get(`${baseUrl}/words/5`)
        .set('Authorization', `bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response3.body)).toBe(true);
      expect(response3.body.length).toBe(5);
    });
  });

  afterAll(async () => {
    await dbConnection.close();
  });
});
