import axios from 'axios';
import userService from './users';

const baseUrl = '/api/games/words';

const getOne = async (excludedWords: string[] = []): Promise<string> => {
  const config = {
    headers: { Authorization: userService.getAuthHeader() },
  };

  const response = await axios.post<string[]>(
    `${baseUrl}/1`,
    { excludedWords },
    config
  );

  if (!Array.isArray(response.data) || !response.data.length) {
    throw new Error('Invalid response when fetching random words');
  }

  return response.data[0];
};

const getMany = async (
  amount: number,
  excludedWords: string[] = []
): Promise<string[]> => {
  if (amount < 1) {
    throw new Error('Amount must be positive');
  }

  const config = {
    headers: { Authorization: userService.getAuthHeader() },
  };

  const response = await axios.post<string[]>(
    `${baseUrl}/${amount}`,
    { excludedWords },
    config
  );

  if (!Array.isArray(response.data) || !response.data.length) {
    throw new Error('Invalid response when fetching random words');
  }

  return response.data;
};

const wordService = {
  getOne,
  getMany,
};

export default wordService;
