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
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../types");
const game_1 = __importDefault(require("../models/game"));
const word_1 = __importDefault(require("../models/word"));
const url_1 = __importDefault(require("../models/url"));
const usersInDb = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.find({});
});
const gamesInDb = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield game_1.default.find({});
});
const addDummyWords = (words) => __awaiter(void 0, void 0, void 0, function* () {
    const wordsToAdd = words.map((word) => new word_1.default({ word }));
    const savedWords = [];
    for (const word of wordsToAdd) {
        const saved = yield word.save();
        savedWords.push(saved);
    }
    return savedWords;
});
const addDummyGame = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const dummyGame = {
        type: types_1.GameType.KOTITONNI,
        price: 10,
        players: [
            {
                id: 'id1',
                name: 'player1',
                points: 0,
                privateData: {
                    answers: {},
                    words: [],
                    twilioToken: null,
                    inviteCode: 'player1code',
                    socketId: null,
                },
                reservedFor: null,
            },
            {
                id: 'id2',
                name: 'player2',
                points: 0,
                privateData: {
                    answers: {},
                    words: [],
                    inviteCode: 'player2code',
                    twilioToken: null,
                    socketId: null,
                },
                reservedFor: null,
            },
        ],
        startTime: new Date(),
        host: {
            id: user._id,
            displayName: 'hostname',
            privateData: {
                socketId: null,
                twilioToken: null,
            },
        },
        status: types_1.GameStatus.UPCOMING,
        rounds: 3,
    };
    const game = new game_1.default(Object.assign(Object.assign({}, dummyGame), { info: {}, createDate: new Date() }));
    const savedGame = yield game.save();
    for (const player of savedGame.players) {
        const newUrl = {
            hostName: user.username,
            playerId: player.id,
            gameId: savedGame._id.toString(),
            inviteCode: player.privateData.inviteCode,
        };
        yield new url_1.default(newUrl).save();
    }
    return savedGame;
});
const addDummyUser = (username = Date.now().toString(), password = Date.now().toString(), email = Date.now().toString(), channelName = Date.now().toString()) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = {
        username,
        password,
        email,
        channelName,
    };
    const passwordHash = yield bcryptjs_1.default.hash(newUser.password, 10);
    const user = new user_1.default({
        username: newUser.username,
        email: newUser.email,
        channelName: newUser.channelName,
        passwordHash,
        joinDate: new Date(),
    });
    return yield user.save();
});
const getValidToken = (user, secret, role) => {
    const tokenUser = {
        username: user.username,
        id: user._id,
        role,
    };
    return jsonwebtoken_1.default.sign(tokenUser, secret);
};
const getSocketIOParams = (address, port) => ({
    path: `http://[${address}]:${port}`,
    options: {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true,
        reconnection: false,
        transports: ['websocket'],
    },
});
exports.default = {
    usersInDb,
    addDummyUser,
    gamesInDb,
    addDummyGame,
    getValidToken,
    getSocketIOParams,
    addDummyWords,
};
