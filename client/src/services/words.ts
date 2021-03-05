import axios from 'axios';
import userService from './users';

const baseUrl = '/api/games/words';

const getOne = async (): Promise<string> => {
  const config = {
    headers: { Authorization: userService.getAuthHeader() },
  };

  const response = await axios.get<string[]>(`${baseUrl}/1`, config);

  if (!Array.isArray(response.data) || !response.data.length) {
    throw new Error('Invalid response when fetching random words');
  }

  return response.data[0];
};

const getMany = async (amount: number): Promise<string[]> => {
  if (amount < 1) {
    throw new Error('Amount must be positive');
  }

  const config = {
    headers: { Authorization: userService.getAuthHeader() },
  };

  const response = await axios.get<string[]>(`${baseUrl}/${amount}`, config);

  if (!Array.isArray(response.data) || !response.data.length) {
    throw new Error('Invalid response when fetching random words');
  }

  return response.data;
};

export default {
  getOne,
  getMany,
};
