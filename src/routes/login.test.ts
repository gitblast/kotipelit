import supertest from 'supertest';

import app from '../app';
import User from '../models/user';
import dbConnection from '../utils/connection';
import testHelpers from '../utils/testHelpers';

const api = supertest(app);

const baseUrl = '/api/login';

describe('login router', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should recieve token with valid credentials', async () => {
    await testHelpers.addDummyUser('username', 'password');

    const credentials = {
      username: 'username',
      password: 'password',
    };

    const response = await api
      .post(baseUrl)
      .send(credentials)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('username');
  });

  it('should return 401 with invalid credentials', async () => {
    await testHelpers.addDummyUser('not', 'matching');

    const credentials = {
      username: 'username',
      password: 'password',
    };

    const response = await api.post(baseUrl).send(credentials).expect(401);

    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('error');

    expect(response.body).not.toHaveProperty('token');
    expect(response.body).not.toHaveProperty('username');
  });

  afterAll(async () => {
    await dbConnection.close();
  });
});
