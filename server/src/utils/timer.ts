import logger from './logger';
import { GameModel, GameType, TimerData } from '../types';
import Game from '../models/game';
import gameService from '../services/games';

export const gamesThatUseTimer = [GameType.KOTITONNI];

const timerCache = new Map<string, DBUpdatingTimer>();

export const initTimer = async (game: GameModel) => {
  logger.log('initializing timer');

  const gameId = game._id.toString();

  const existing = timerCache.get(gameId);

  /** check cache first */
  if (existing) {
    return existing;
  }

  if (!game.info.timer) {
    throw new Error(`game info has no timer property`);
  }

  const { value, isRunning } = game.info.timer;

  const tickInterval = process.env.NODE_ENV === 'development' ? 100 : 1000;

  const timer = new DBUpdatingTimer(gameId, value, isRunning, tickInterval);

  timerCache.set(gameId, timer);

  return timer;
};

export const getTimer = async (gameId: string) => {
  const existing = timerCache.get(gameId);

  if (existing) {
    return existing;
  }

  const game = await gameService.getGameById(gameId);

  return await initTimer(game);
};

export default class DBUpdatingTimer {
  private timeOutHandle: null | NodeJS.Timeout;

  gameId: string;
  value: number;
  isRunning: boolean;
  tickInterval: number;

  constructor(
    gameId: string,
    initialValue = 60,
    initialRunning = false,
    tickInterval = 1000
  ) {
    this.gameId = gameId;
    this.value = initialValue;
    this.isRunning = initialRunning;
    this.timeOutHandle = null;
    this.tickInterval = tickInterval;

    if (initialRunning) {
      this.start();
    }
  }

  private async saveState() {
    await Game.findByIdAndUpdate(this.gameId, {
      $set: { 'info.timer': this.getState() },
    });
  }

  private setState(newIsRunning?: boolean, newValue?: number) {
    this.isRunning = newIsRunning ?? this.isRunning;
    this.value = newValue ?? this.value;

    this.saveState();
  }

  private tick() {
    const newVal = this.value - 1;

    this.setState(newVal > 0, newVal);

    if (this.value > 0) {
      // needs to be bound, otherwise this will reference setTimeout
      this.timeOutHandle = setTimeout(this.tick.bind(this), this.tickInterval);
    } else {
      this.timeOutHandle = null;
    }
  }

  getState(): TimerData {
    return {
      value: this.value,
      isRunning: this.isRunning,
    };
  }

  start() {
    if (this.value >= 1) {
      this.setState(true);

      // needs to be bound, otherwise this will reference setTimeout
      this.timeOutHandle = setTimeout(this.tick.bind(this), this.tickInterval);
    } else {
      logger.log(`cannot start timer when value is ${this.value}`);
    }
  }

  stop() {
    if (this.timeOutHandle) {
      clearTimeout(this.timeOutHandle);

      this.timeOutHandle = null;
    }

    if (this.isRunning) {
      this.setState(false, this.value);
    }
  }

  reset(noUpdate = true, initialValue = 60) {
    if (this.timeOutHandle) {
      clearTimeout(this.timeOutHandle);

      this.timeOutHandle = null;
    }

    if (noUpdate) {
      /** do not update database */

      this.value = initialValue;
      this.isRunning = false;
    } else {
      this.setState(false, initialValue);
    }
  }
}
