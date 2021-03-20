enum ErrorType {
  RoomNotFound = 'RoomNotFound',
}

class ErrorWithType extends Error {
  type: string;

  constructor(message: string, type: ErrorType) {
    super(message);
    this.type = type;
  }
}

export class RoomNotFoundError extends ErrorWithType {
  constructor(roomId: string) {
    super(`No room found with id '${roomId}'`, ErrorType.RoomNotFound);
  }
}
