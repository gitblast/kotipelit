import axios from 'axios';
import { IceServers } from '../types';

const getIceServers = async (): Promise<IceServers> => {
  const response = await axios.get('/api/webrtc');

  if (!response?.data?.v?.iceServers) {
    throw new Error('Error getting ICE server list');
  }

  return response.data.v.iceServers;
};

export default {
  getIceServers,
};
