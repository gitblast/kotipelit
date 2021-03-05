"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAnswer = exports.getRoomGame = exports.handleTimerChange = exports.endRTCGame = exports.updateRTCGame = exports.launchRTCGame = exports.startRTCGame = exports.leaveRTCRoom = exports.socketDisconnected = exports.joinRTCRoom = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const types_1 = require("../../types");
const logger_1 = __importDefault(require("../../utils/logger"));
const games_1 = __importDefault(require("../games"));
const rtcrooms_1 = __importDefault(require("../rtc/rtcrooms"));
const twilio_1 = __importDefault(require("../twilio"));
// RTC
exports.joinRTCRoom = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.log(`recieved 'join-gameroom' from ${socket.decodedToken.username}`);
    try {
        const { gameId } = socket.decodedToken;
        const existingRoom = rtcrooms_1.default.getRoomGame(gameId);
        if (!existingRoom) {
            const game = yield games_1.default.getGameById(gameId);
            if (game.status === types_1.GameStatus.FINISHED) {
                throw new Error('cannot join, game status is finished!');
            }
            const rtcGame = games_1.default.convertToRTCGame(game);
            rtcrooms_1.default.createRoom(rtcGame);
        }
        const joinedRoomGame = rtcrooms_1.default.joinRoom(socket);
        socket.emit('game-updated', joinedRoomGame);
    }
    catch (e) {
        logger_1.default.error(e.message);
        socket.emit('rtc-error', e.message);
    }
});
exports.socketDisconnected = (socket, reason) => {
    logger_1.default.log(`recieved disconnect from ${socket.decodedToken.username}. reason: ${reason}`);
    const { id, gameId } = socket.decodedToken;
    if (reason !== 'Ping timeout') {
        // emit user-left?host
    }
    socket.to(gameId).emit('user-socket-disconnected', id);
};
exports.leaveRTCRoom = (socket) => {
    logger_1.default.log(`recieved leave-room from ${socket.decodedToken.username}`);
    const { id, gameId } = socket.decodedToken;
    rtcrooms_1.default.leaveRoom(gameId, id);
    socket.to(gameId).emit('user-left', id);
};
exports.startRTCGame = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.log(`recieved 'start' from ${socket.decodedToken.username}`);
    try {
        const { gameId } = socket.decodedToken;
        const game = rtcrooms_1.default.getRoomGame(gameId);
        if (!game) {
            throw new Error(`no game set when starting, id ${gameId}`);
        }
        if (game.status !== types_1.GameStatus.WAITING) {
            throw new Error(`game with id ${gameId} already started`);
        }
        yield games_1.default.setGameStatus(gameId, types_1.GameStatus.RUNNING);
        const updatedGame = rtcrooms_1.default.updateRoom(gameId, Object.assign(Object.assign({}, game), { status: types_1.GameStatus.RUNNING }));
        emitUpdatedGame(socket, updatedGame);
    }
    catch (e) {
        logger_1.default.error(e.message);
        socket.emit('rtc-error', e.message);
    }
});
exports.launchRTCGame = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.log(`recieved 'launch' from ${socket.decodedToken.username}`);
    try {
        const { gameId, id } = socket.decodedToken;
        const game = rtcrooms_1.default.getRoomGame(gameId);
        if (!game) {
            throw new Error(`no game set when launching, id ${gameId}`);
        }
        let alreadyLaunched = false; // for dev purposes
        if (game.status !== types_1.GameStatus.UPCOMING) {
            logger_1.default.error(`game with id ${gameId} already launched`);
            alreadyLaunched = true;
        }
        const timeDifference = new Date(game.startTime).getTime() - Date.now();
        // check if difference is greater than 30 minutes
        if (timeDifference > 30 * 60 * 1000) {
            throw new Error(`game start time is over 30 minutes away! time until start: ${Math.round(timeDifference / 1000 / 60)} minutes`);
        }
        // do not update state if game has already been launched
        const updatedGameInDB = alreadyLaunched
            ? game
            : yield games_1.default.setGameStatus(gameId, types_1.GameStatus.WAITING);
        logger_1.default.log('generating access tokens');
        // access token for host
        const hostToken = twilio_1.default.getVideoAccessToken(id, `kotipelit-${gameId}`);
        // update player display names and game status, generate access tokens
        const updatedGame = Object.assign(Object.assign({}, game), { status: updatedGameInDB.status, host: Object.assign(Object.assign({}, game.host), { privateData: Object.assign(Object.assign({}, game.host.privateData), { twilioToken: hostToken }) }), players: game.players.map((player) => {
                const matching = updatedGameInDB.players.find((p) => p.id === player.id);
                const token = twilio_1.default.getVideoAccessToken(player.id, `kotipelit-${game.id}`);
                const playerWithAccessToken = Object.assign(Object.assign({}, player), { privateData: Object.assign(Object.assign({}, player.privateData), { twilioToken: token }) });
                if (!matching || player.name === matching.name) {
                    return playerWithAccessToken;
                }
                logger_1.default.log(`updating name for player '${matching.name}'`);
                return Object.assign(Object.assign({}, playerWithAccessToken), { name: matching.name });
            }) });
        rtcrooms_1.default.updateRoom(gameId, updatedGame);
        emitUpdatedGame(socket, updatedGame);
    }
    catch (e) {
        logger_1.default.error(e.message);
        socket.emit('rtc-error', e.message);
    }
});
exports.updateRTCGame = (socket, newGame) => {
    logger_1.default.log(`recieved 'update-game' from ${socket.decodedToken.username}`);
    try {
        const { gameId } = socket.decodedToken;
        const game = rtcrooms_1.default.getRoomGame(gameId);
        if (!game) {
            throw new Error(`no game set when updating, id ${gameId}`);
        }
        const updatedGame = rtcrooms_1.default.updateRoom(gameId, newGame);
        emitUpdatedGame(socket, updatedGame);
    }
    catch (e) {
        logger_1.default.error(e.message);
        socket.emit('rtc-error', e.message);
    }
};
exports.endRTCGame = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.log(`recieved 'end' from ${socket.decodedToken.username}`);
    try {
        const { gameId } = socket.decodedToken;
        const game = rtcrooms_1.default.getRoomGame(gameId);
        if (!game) {
            throw new Error(`no game set when ending, id ${gameId}`);
        }
        logger_1.default.log('saving finished game to db');
        // save to db
        yield games_1.default.saveFinishedGame(gameId, game);
        logger_1.default.log(`deleting room... `);
        const success = rtcrooms_1.default.deleteRoom(gameId);
        logger_1.default.log(success ? 'delete succesful' : 'delete failed');
        socket.to(gameId).emit('game-ended');
    }
    catch (e) {
        logger_1.default.error(e.message);
        socket.emit('rtc-error', e.message);
    }
});
exports.handleTimerChange = (socket, value) => {
    // log(`recieved 'timer' from ${socket.decodedToken.username}`);
    try {
        const { gameId } = socket.decodedToken;
        socket.to(gameId).emit('timer-changed', value);
    }
    catch (e) {
        logger_1.default.error(e.message);
        socket.emit('rtc-error', e.message);
    }
};
const logRecievedMsg = (event, socket) => {
    logger_1.default.log(`recieved '${event}' from ${socket.decodedToken.username}`);
};
exports.getRoomGame = (socket) => {
    logRecievedMsg('get-room-game', socket);
    try {
        const { gameId, id } = socket.decodedToken;
        const game = rtcrooms_1.default.getRoomGame(gameId);
        if (!game) {
            throw new Error(`no game set when trying to get room id ${gameId}`);
        }
        const filteredGame = games_1.default.filterGameForUser(game, id);
        socket.emit('game-updated', filteredGame);
    }
    catch (e) {
        logger_1.default.error(e.message);
        socket.emit('rtc-error', e.message);
    }
};
exports.handleAnswer = (socket, answer) => {
    logger_1.default.log(`recieved 'answer' from ${socket.decodedToken.username}`);
    try {
        const { id, gameId } = socket.decodedToken;
        const game = rtcrooms_1.default.getRoomGame(gameId);
        if (!game) {
            throw new Error(`no game set when trying to answer, game id ${gameId}`);
        }
        const newGame = Object.assign(Object.assign({}, game), { players: game.players.map((player) => {
                return player.id === id
                    ? Object.assign(Object.assign({}, player), { privateData: Object.assign(Object.assign({}, player.privateData), { answers: Object.assign(Object.assign({}, player.privateData.answers), { [answer.info.turn]: Object.assign(Object.assign({}, player.privateData.answers[answer.info.turn]), { [answer.info.round]: answer.answer }) }) }) }) : player;
            }) });
        const updatedGame = rtcrooms_1.default.updateRoom(gameId, newGame);
        const hostSocketId = game.host.privateData.socketId;
        if (hostSocketId) {
            socket.to(hostSocketId).emit('game-updated', updatedGame);
        }
        socket.emit('game-updated', games_1.default.filterGameForUser(updatedGame, id));
    }
    catch (e) {
        logger_1.default.error(e.message);
        socket.emit('rtc-error', e.message);
    }
};
const emitUpdatedGame = (socket, newGame) => {
    const { role } = socket.decodedToken;
    logger_1.default.log(`emitting game-updated`);
    // handle game types here
    if (newGame.type === types_1.GameType.KOTITONNI) {
        if (role === types_1.Role.HOST) {
            socket.emit('game-updated', newGame);
            // doesn't send other players' words
            newGame.players.forEach((player) => {
                if (player.privateData.socketId) {
                    socket
                        .to(player.privateData.socketId)
                        .emit('game-updated', games_1.default.filterGameForUser(newGame, player.id));
                }
            });
        }
    }
};
