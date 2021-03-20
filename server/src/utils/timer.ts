import { Server } from 'socket.io';
import logger from './logger';

export default class UpdateEmittingTimer {
  private ioServer: Server;
  private roomId: string;
  private timeOutHandle: null | NodeJS.Timeout;
  value: number;
  isRunning: boolean;

  constructor(ioServer: Server, roomId: string, initialValue = 60) {
    this.ioServer = ioServer;
    this.roomId = roomId;
    this.value = initialValue;
    this.isRunning = false;
    this.timeOutHandle = null;
  }

  private emitUpdates() {
    this.ioServer.to(this.roomId).emit('timer-updated', this.getState());
  }

  private getState() {
    return {
      value: this.value,
      isRunning: this.isRunning,
    };
  }

  private setState(newIsRunning?: boolean, newValue?: number) {
    this.isRunning = newIsRunning ?? this.isRunning;
    this.value = newValue ?? this.value;

    this.emitUpdates();
  }

  private tick() {
    const newVal = this.value - 1;

    this.setState(newVal > 0, newVal);

    if (this.value > 0) {
      // needs to be bound, otherwise this will reference setTimeout
      this.timeOutHandle = setTimeout(this.tick.bind(this), 1000);
    } else {
      this.timeOutHandle = null;
    }
  }

  start() {
    if (this.value >= 1) {
      this.setState(true);

      // needs to be bound, otherwise this will reference setTimeout
      this.timeOutHandle = setTimeout(this.tick.bind(this), 1000);
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

  reset(initialValue = 60) {
    if (this.timeOutHandle) {
      clearTimeout(this.timeOutHandle);

      this.timeOutHandle = null;
    }

    this.setState(false, initialValue);
  }
}
