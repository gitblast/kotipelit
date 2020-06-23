/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import supertest from 'supertest';

import app from '../app';
import Game from '../models/game';
import dbConnection from '../utils/connection';
import testHelpers from '../utils/testHelpers';

const api = supertest(app);

const baseUrl = '/api/games';

const dummyGame = {
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
};

describe('games router', () => {
  beforeEach(async () => {
    await Game.deleteMany({});
  });

  it('should add a valid game', async () => {
    const user = await testHelpers.addDummyUser();

    const initialGames = await testHelpers.gamesInDb();

    const newGame = {
      ...dummyGame,
      host: user._id,
    };

    const response = await api
      .post(baseUrl)
      .send(newGame)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const gamesAtEnd = await testHelpers.gamesInDb();

    expect(gamesAtEnd.length).toBe(initialGames.length + 1);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('createDate');
    expect(response.body).toHaveProperty('_id');
  });

  it('should return 400 with invalid game object', async () => {
    const user = await testHelpers.addDummyUser();

    await api.post(baseUrl).send(dummyGame).expect(400);
    await api
      .post(baseUrl)
      .send({ ...dummyGame, host: user._id, players: undefined })
      .expect(400);
    await api
      .post(baseUrl)
      .send({ ...dummyGame, host: user._id, type: undefined })
      .expect(400);
    await api
      .post(baseUrl)
      .send({ ...dummyGame, host: user._id, startTime: undefined })
      .expect(400);
  });

  afterAll(async () => {
    await dbConnection.close();
  });
});
