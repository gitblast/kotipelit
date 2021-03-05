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
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const game_1 = __importDefault(require("../models/game"));
const types_1 = require("../types");
const filterGameForUser = (game, userId) => {
    if (userId === game.host.id.toString()) {
        // return all data to host
        return game;
    }
    if (game.type === types_1.GameType.KOTITONNI) {
        // hide private data
        return Object.assign(Object.assign({}, game), { host: Object.assign(Object.assign({}, game.host), { privateData: null }), players: game.players.map((player) => {
                return player.id === userId
                    ? player
                    : Object.assign(Object.assign({}, player), { reservedFor: null, privateData: null });
            }) });
    }
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`invalid game type: ${game.type}`);
};
const getInviteMailData = (game, playerId, displayName, hostName) => {
    switch (game.type) {
        case types_1.GameType.KOTITONNI: {
            const player = game.players.find((player) => player.id === playerId);
            if (!player || !player.privateData.words) {
                throw new Error('Missing or invalid player when getting mail data');
            }
            return {
                url: `https://www.kotipelit.com/${hostName}/${player.privateData.inviteCode}`,
                cancelUrl: `https://www.kotipelit.com/${hostName}/peruuta/${player.privateData.inviteCode}`,
                gameType: types_1.GameType.KOTITONNI,
                displayName,
                startTime: game.startTime,
                data: {
                    words: player.privateData.words,
                },
            };
        }
        default: {
            throw new Error('unknown game type');
        }
    }
};
const refreshGameReservations = (gameId) => __awaiter(void 0, void 0, void 0, function* () {
    const game = yield game_1.default.findById(gameId);
    if (!game) {
        throw new Error(`Invalid request: no game found with id ${gameId}`);
    }
    if (game.status !== types_1.GameStatus.UPCOMING) {
        throw new Error(`Invalid request: game status is not upcoming`);
    }
    game.players = game.players.map((player) => {
        return player.reservedFor &&
            !player.reservedFor.locked &&
            player.reservedFor.expires < Date.now()
            ? Object.assign(Object.assign({}, player), { reservedFor: null }) : player;
    });
    return yield game.save();
});
const getInitialInfo = (game) => {
    /** handle different game types here */
    switch (game.type) {
        case types_1.GameType.KOTITONNI: {
            if (!game.players || !game.players.length)
                throw new Error('Game has no players set');
            const playerWithTurn = game.players[0];
            return {
                round: 1,
                turn: playerWithTurn.id,
                answeringOpen: false,
            };
        }
        default: {
            const gameType = game.type;
            throw new Error(`Invalid game type: ${gameType}`);
        }
    }
};
const getGameById = (gameId) => __awaiter(void 0, void 0, void 0, function* () {
    const gameInDB = yield game_1.default.findById(gameId);
    if (!gameInDB) {
        throw new Error(`No game found with id ${gameId}`);
    }
    return gameInDB;
});
const saveFinishedGame = (gameId, game) => __awaiter(void 0, void 0, void 0, function* () {
    const gameInDB = yield game_1.default.findById(gameId);
    if (!gameInDB)
        throw new Error(`No game found with id ${gameId}`);
    gameInDB.players = game.players;
    gameInDB.status = types_1.GameStatus.FINISHED;
    return yield gameInDB.save();
});
const setGameStatus = (gameId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const game = yield game_1.default.findById(gameId);
    if (!game)
        throw new Error(`No game found with id ${gameId}`);
    game.status = newStatus;
    return yield game.save();
});
const convertToRTCGame = (game) => {
    return {
        id: game._id.toString(),
        status: game.status,
        type: game.type,
        price: game.price,
        startTime: game.startTime,
        players: game.players,
        info: getInitialInfo(game),
        host: {
            id: game.host.id.toString(),
            displayName: game.host.displayName,
            privateData: {
                socketId: null,
                twilioToken: null,
            },
        },
        rounds: game.rounds,
    };
};
const subscribeToUpdates = (socket) => {
    console.log('todo', socket);
};
exports.default = {
    saveFinishedGame,
    setGameStatus,
    getInitialInfo,
    getGameById,
    convertToRTCGame,
    refreshGameReservations,
    getInviteMailData,
    subscribeToUpdates,
    filterGameForUser,
};
