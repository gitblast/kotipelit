import axios from 'axios';

import userService from './users';
import { SelectableGame } from '../types';

const baseUrl = 'api/games';

const getAll = async (): Promise<SelectableGame[]> => {
  const config = {
    headers: { Authorization: userService.getAuthHeader() },
  };

  const response = await axios.get(baseUrl, config);

  return response.data;
};

export default {
  getAll,
};
