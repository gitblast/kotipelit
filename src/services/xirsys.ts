import axios from 'axios';
import { IceServers } from '../types';

const getIceServers = async (token: string): Promise<IceServers> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios.get('/api/webrtc', config);

  if (!response?.data?.v?.iceServers) {
    throw new Error('Error getting ICE server list');
  }

  return response.data.v.iceServers;
};

export default {
  getIceServers,
};
