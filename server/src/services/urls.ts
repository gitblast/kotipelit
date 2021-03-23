import Url from '../models/url';
import { GameModel } from '../types';

const deleteGameUrls = async (gameId: string) => {
  await Url.deleteMany({ gameId });
};

const getUrlData = async (hostName: string, inviteCode: string) => {
  const urlData = await Url.findOne({ hostName, inviteCode });

  if (!urlData) {
    throw new Error(
      `Invalid url: no game found with host name '${hostName}' and invite code '${inviteCode}'`
    );
  }

  return urlData;
};

const createPlayerUrls = async (game: GameModel, hostName: string) => {
  for (const player of game.players) {
    const urlObject = {
      playerId: player.id,
      gameId: game._id.toString(),
      hostName: hostName,
      inviteCode: player.privateData.inviteCode,
    };

    const newUrl = new Url(urlObject);
    await newUrl.save();
  }
};

export default {
  deleteGameUrls,
  getUrlData,
  createPlayerUrls,
};
