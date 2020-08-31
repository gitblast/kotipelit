import userService from './users';
import axios, { AxiosResponse } from 'axios';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('user service', () => {
  describe('login', () => {
    it('should return username and token on succesful login', async () => {
      const response: AxiosResponse = {
        data: { username: 'username', token: 'token' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockedAxios.post.mockImplementationOnce(() => Promise.resolve(response));

      const user = await userService.login('username', 'password');
      expect(user).toBe(response.data);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/login', {
        username: 'username',
        password: 'password',
      });
    });
  });

  describe('fetch all', () => {
    it('should return an array of users', async () => {
      const response: AxiosResponse = {
        data: ['array of users'],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockedAxios.get.mockImplementationOnce(() => Promise.resolve(response));

      const users = await userService.getAll();
      expect(users).toBe(response.data);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/users');
    });
  });

  describe('token', () => {
    it('should have token initially set as null', () => {
      expect(userService.getToken()).toBe(null);
    });

    it('should set token with setToken', () => {
      const token = 'token';

      expect(userService.getToken()).toBe(null);
      userService.setToken(token);
      expect(userService.getToken()).toBe(token);
    });
  });

  describe('getAuthHeader', () => {
    it('should throw error if token is not set', () => {
      userService.setToken(null);
      expect(() => userService.getAuthHeader()).toThrowError(
        'Käyttäjän token puuttuu'
      );
    });

    it('should return valid auth header if token is set', () => {
      userService.setToken('token');

      expect(userService.getAuthHeader()).toBe('Bearer token');
    });
  });
});
