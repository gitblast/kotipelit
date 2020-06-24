import supertest from 'supertest';

import app from '../app';
import config from '../utils/config';
import User from '../models/user';
import dbConnection from '../utils/connection';
import testHelpers from '../utils/testHelpers';

const api = supertest(app);

import { NewUser } from '../types';

const baseUrl = '/api/users';

const dummy: NewUser = {
  username: 'user',
  password: 'pass',
  email: 'email',
  channelName: 'channel',
};

let adminToken: string;

describe('user router', () => {
  beforeAll(async () => {
    const user = await testHelpers.addDummyUser();
    adminToken = testHelpers.getValidToken(user, config.ADMIN_SECRET);
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should return 401 without valid admin token', async () => {
    const user = await testHelpers.addDummyUser();
    const hostToken = testHelpers.getValidToken(user, config.SECRET);

    await api.post(baseUrl).send(dummy).expect(401);
    await api
      .post(baseUrl)
      .send(dummy)
      .set('Authorization', `bearer ${hostToken}`)
      .expect(401);
  });

  it('should add a valid user with valid admin token', async () => {
    const newUser = { ...dummy };

    const initialUsers = await testHelpers.usersInDb();

    await api
      .post(baseUrl)
      .send(newUser)
      .set('Authorization', `bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await testHelpers.usersInDb();

    expect(usersAtEnd.length).toBe(initialUsers.length + 1);
    expect(usersAtEnd.map((user) => user.username)).toContain(newUser.username);
  });

  it('should not add duplicate usernames or emails with valid admin token', async () => {
    await testHelpers.addDummyUser(dummy.username, dummy.email);

    const uniqueUser = {
      username: Date.now.toString(),
      email: Date.now.toString(),
    };

    await api
      .post(baseUrl)
      .send({ ...uniqueUser, username: dummy.username })
      .set('Authorization', `bearer ${adminToken}`)
      .expect(400);
    await api
      .post(baseUrl)
      .send({ ...uniqueUser, email: dummy.email })
      .set('Authorization', `bearer ${adminToken}`)
      .expect(400);
  });

  it('should return all users as json', async () => {
    const beforeAdd = await testHelpers.usersInDb();

    await testHelpers.addDummyUser();
    await testHelpers.addDummyUser();
    await testHelpers.addDummyUser();

    await api
      .get(baseUrl)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const afterAdd = await testHelpers.usersInDb();
    expect(afterAdd.length).toBe(beforeAdd.length + 3);
  });

  it('should return 400 with invalid user objects using valid token', async () => {
    const noUsername = {
      ...dummy,
      username: undefined,
    };

    const noPassword = {
      ...dummy,
      password: undefined,
    };

    const noEmail = {
      ...dummy,
      email: undefined,
    };

    const noChannelName = {
      ...dummy,
      password: undefined,
    };

    await api
      .post(baseUrl)
      .send(noUsername)
      .set('Authorization', `bearer ${adminToken}`)
      .expect(400);
    await api
      .post(baseUrl)
      .send(noPassword)
      .set('Authorization', `bearer ${adminToken}`)
      .expect(400);
    await api
      .post(baseUrl)
      .send(noEmail)
      .set('Authorization', `bearer ${adminToken}`)
      .expect(400);
    await api
      .post(baseUrl)
      .send(noChannelName)
      .set('Authorization', `bearer ${adminToken}`)
      .expect(400);
  });

  afterAll(async () => {
    await dbConnection.close();
  });
});
