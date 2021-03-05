"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const logger_1 = __importDefault(require("../../utils/logger"));
const games_1 = __importDefault(require("../games"));
const rooms = new Map();
const joinRoom = (socket) => {
    const { role, gameId, id, username } = socket.decodedToken;
    const game = rooms.get(gameId);
    if (!game) {
        throw new Error(`No room found with id ${gameId}`);
    }
    logger_1.default.log(`joining ${role} (${username}) to room ${gameId}`);
    switch (role) {
        case types_1.Role.HOST: {
            const newGame = Object.assign(Object.assign({}, game), { host: Object.assign(Object.assign({}, game.host), { privateData: Object.assign(Object.assign({}, game.host.privateData), { socketId: socket.id }) }) });
            rooms.set(gameId, newGame);
            return newGame;
        }
        case types_1.Role.PLAYER: {
            const newGame = Object.assign(Object.assign({}, game), { players: game.players.map((player) => {
                    return player.id === id
                        ? Object.assign(Object.assign({}, player), { privateData: Object.assign(Object.assign({}, player.privateData), { socketId: socket.id }) }) : player;
                }) });
            rooms.set(gameId, newGame);
            return games_1.default.filterGameForUser(newGame, id);
        }
        default: {
            throw new Error('No role set for token!');
        }
    }
};
const getRoomGame = (id) => {
    const room = rooms.get(id);
    return room !== null && room !== void 0 ? room : null;
};
const createRoom = (game) => {
    const existing = rooms.get(game.id);
    if (existing) {
        throw new Error(`Room with id ${game.id} already exists.`);
    }
    logger_1.default.log(`creating room for game ${game.id}`);
    rooms.set(game.id, game);
};
const leaveRoom = (gameId, userId) => {
    const game = rooms.get(gameId);
    if (game) {
        if (userId === game.host.id) {
            logger_1.default.log(`host left`);
            const newGame = Object.assign(Object.assign({}, game), { host: Object.assign(Object.assign({}, game.host), { privateData: Object.assign(Object.assign({}, game.host.privateData), { socketId: null }) }) });
            rooms.set(gameId, newGame);
        }
        else {
            logger_1.default.log(`player ${userId} left`);
            const newGame = Object.assign(Object.assign({}, game), { players: game.players.map((player) => {
                    return player.id === userId
                        ? Object.assign(Object.assign({}, player), { privateData: Object.assign(Object.assign({}, player.privateData), { socketId: null }) }) : player;
                }) });
            rooms.set(gameId, newGame);
        }
    }
};
const getRooms = () => rooms;
const updateRoom = (gameId, newGame) => {
    const room = rooms.get(gameId);
    if (!room) {
        throw new Error(`no room set with id ${gameId}`);
    }
    rooms.set(gameId, newGame);
    return newGame;
};
const deleteRoom = (gameId) => {
    return rooms.delete(gameId);
};
exports.default = {
    createRoom,
    joinRoom,
    getRoomGame,
    leaveRoom,
    updateRoom,
    getRooms,
    deleteRoom,
};
