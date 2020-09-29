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
import { NewGame, GameStatus, UserModel, Role, GameType } from '../types';
import Word from '../models/word';

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
    },
    {
      id: 'id2',
      name: 'player2',
      points: 0,
    },
  ],
  startTime: new Date(),
  status: GameStatus.UPCOMING,
  rounds: 3,
};

let user: UserModel;
let token: string;

describe('games router', () => {
  beforeAll(async () => {
    user = await testHelpers.addDummyUser();
    token = testHelpers.getValidToken(user, config.SECRET, Role.HOST);
  });

  beforeEach(async () => {
    await Game.deleteMany({});
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

  describe('GET /:hostName/:playerId', () => {
    it('should return object with token and display name with valid parameters', async () => {
      const game = await testHelpers.addDummyGame(user);
      const gameId: string = game._id.toString();

      const player = dummyGame.players[0];

      const hostName = user.username;

      const response = await api
        .get(`${baseUrl}/join/${hostName}/${player.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const expectedPayload = {
        username: player.name,
        id: player.id,
        gameId: gameId,
        type: 'jitsi',
        role: Role.PLAYER,
      };

      const decodedToken = jwt.verify(
        response.body.token,
        config.SECRET
      ) as Record<string, string>;

      // remove iat field
      delete decodedToken.iat;

      expect(decodedToken).toEqual(expectedPayload);
      expect(response.body.displayName).toBe(player.name);
    });

    it('should return 400 with invalid host name or player id', async () => {
      const game = await testHelpers.addDummyGame(user);

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
      expect(response.body.length).toBe(2);

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

      const game = await testHelpers.addDummyGame(user);

      const tempGames = await testHelpers.gamesInDb();

      expect(tempGames.length).toBe(initialGames.length + 1);

      const id: string = game._id.toString();

      await api
        .delete(`${baseUrl}/${id}`)
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
