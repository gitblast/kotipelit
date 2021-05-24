import Game from '../models/game';
import { Server } from 'socket.io';
import { RTCGame, FilteredRTCGame, GameModel, Role } from '../types';
import logger from '../utils/logger';

const filterChanges = (
  changes: Partial<RTCGame>,
  playerId?: string // private data matching this id will not be hidden
) => {
  const filtered: Partial<FilteredRTCGame> = {
    ...changes,
  };

  if (filtered.players) {
    filtered.players = filtered.players.map((player) =>
      player.id === playerId
        ? player
        : {
            ...player,
            privateData: null,
          }
    );
  }

  return filtered;
};

const GAME_NAMESPACE = '/games';
const DASHBOARD_NAMESPACE = '/dash';

export const setupChangeStreams = (io: Server) => {
  const gameChangeStream = Game.watch([], { fullDocument: 'updateLookup' });

  gameChangeStream.on('change', (data) => {
    if (data.operationType === 'update') {
      const gameObj = data.fullDocument as GameModel;

      if (!gameObj) {
        logger.error(
          'unexpected: fullDocument was not defined on change stream'
        );

        return;
      }

      const gameId = gameObj._id.toString();

      delete gameObj._id;
      delete gameObj.__v;

      const game = {
        ...gameObj,
        id: gameId,
      };

      /** emit updated document to dashboard */
      io.of(DASHBOARD_NAMESPACE)
        .to(game.host.id.toString())
        .emit('game-has-updated', game);

      const changes = data.updateDescription.updatedFields;

      const isTimerUpdate = !!changes['info.timer'];

      /** fixes issue with mongodb returning "info.timer" instead of { info: { timer: ... } } when modifying subfields only */
      if (isTimerUpdate) {
        changes.info = {
          ...game.info,
        };

        delete changes['info.timer'];
      }

      if (changes.players) {
        /** hide player's private data from other players and spectators */

        // logger.log('emitting filtered changes');

        /** emit unfiltered changes to host */
        io.of(GAME_NAMESPACE)
          .to(`${gameId}/${Role.HOST}`)
          .emit('game-changed', changes);

        /** emit filtered changes to players */
        game.players.forEach((player) => {
          /** could use cache here to check if filtered game differs from previous emit for each socket */

          const filteredChanges = filterChanges(changes, player.id);

          io.of(GAME_NAMESPACE)
            .to(player.id)
            .emit('game-changed', filteredChanges);
        });

        const spectatorChanges = filterChanges(changes);

        /** emit filtered changes to spectators */
        io.of(GAME_NAMESPACE)
          .to(`${gameId}/${Role.SPECTATOR}`)
          .emit('game-changed', spectatorChanges);
      } else {
        /** emit changes to everyone in the room if players did not change */

        if (!isTimerUpdate) {
          /** suppress timer change logs */
          // logger.log('emitting changes');
        }

        io.of(GAME_NAMESPACE)
          .to(gameId)
          .emit('game-changed', changes, isTimerUpdate);
      }
    }
  });
};
