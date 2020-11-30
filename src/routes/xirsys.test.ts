import supertest from 'supertest';
import app from '../app';
import axios from 'axios';
import dbConnection from '../utils/connection';
import config from '../utils/config';

jest.mock('../utils/config');
jest.mock('axios');

const api = supertest(app);

const baseUrl = '/api/webrtc';

const mockResponse = {
  data: 'testing',
};

const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.put.mockResolvedValue(mockResponse);

describe('xirsys router', () => {
  it('should send a put request to xirsys with correct credentials', async () => {
    const response = await api.get(baseUrl).expect(200);

    expect(response.body).toBe(mockResponse.data);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedAxios.put).toHaveBeenLastCalledWith(
      config.XIRSYS_URL,
      {
        format: 'urls',
      },
      {
        headers: {
          Authorization:
            'Basic ' + Buffer.from(config.XIRSYS_SECRET).toString('base64'),
        },
      }
    );
  });

  afterAll(async () => {
    await dbConnection.close();
  });
});
