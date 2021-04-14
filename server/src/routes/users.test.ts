/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import supertest from 'supertest';

import app from '../app';
import config from '../utils/config';
import User from '../models/user';
import dbConnection from '../utils/connection';
import testHelpers from '../utils/testHelpers';

jest.setTimeout(10000);

const api = supertest(app);

import { NewUser, Role } from '../types';

const baseUrl = '/api/users';

const dummy: NewUser = {
  username: 'user',
  password: 'pass',
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  birthYear: 1969,
  status: 'active',
  confirmationId: Date.now().toString(),
};

let adminToken: string;

describe('user router', () => {
  beforeAll(async () => {
    const user = await testHelpers.addDummyUser();
    adminToken = testHelpers.getValidToken(
      user,
      config.ADMIN_SECRET,
      Role.HOST
    );
  });

  beforeEach(async () => {
    await User.deleteMany({});
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

    const response = await api
      .get(baseUrl)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const afterAdd = await testHelpers.usersInDb();
    expect(afterAdd.length).toBe(beforeAdd.length + 3);

    expect(response.body).toBeDefined();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response.body.forEach((channel: any) => {
      expect(channel).not.toHaveProperty('passwordHash');
      expect(channel).not.toHaveProperty('email');
    });
  });

  it('should return 400 without username', async () => {
    const noUsername = {
      ...dummy,
      username: undefined,
    };

    await api
      .post(baseUrl)
      .send(noUsername)
      .set('Authorization', `bearer ${adminToken}`)
      .expect(400);
  });

  it('should return 400 without password', async () => {
    const noPassword = {
      ...dummy,
      password: undefined,
    };

    await api
      .post(baseUrl)
      .send(noPassword)
      .set('Authorization', `bearer ${adminToken}`)
      .expect(400);
  });

  it('should return 400 without email', async () => {
    const noEmail = {
      ...dummy,
      email: undefined,
    };

    await api
      .post(baseUrl)
      .send(noEmail)
      .set('Authorization', `bearer ${adminToken}`)
      .expect(400);
  });

  afterAll(async () => {
    await dbConnection.close();
  });
});
