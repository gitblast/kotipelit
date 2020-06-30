/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import supertest from 'supertest';

import app from '../app';
import config from '../utils/config';
import Game from '../models/game';
import dbConnection from '../utils/connection';
import testHelpers from '../utils/testHelpers';
import { NewGame, GameStatus, UserModel } from '../types';

const api = supertest(app);

const baseUrl = '/api/games';

const dummyGame: Omit<NewGame, 'host'> = {
  type: 'sanakierto',
  players: [
    {
      id: 'id1',
      name: 'player1',
    },
    {
      id: 'id2',
      name: 'player2',
    },
  ],
  startTime: new Date(),
  status: GameStatus.UPCOMING,
};

let user: UserModel;
let token: string;

describe('games router', () => {
  beforeAll(async () => {
    user = await testHelpers.addDummyUser();
    token = testHelpers.getValidToken(user, config.SECRET);
  });

  beforeEach(async () => {
    await Game.deleteMany({});
  });

  it('should return 401 without valid token', async () => {
    await api.post(baseUrl).send(dummyGame).expect(401);
  });

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

  afterAll(async () => {
    await dbConnection.close();
  });
});
