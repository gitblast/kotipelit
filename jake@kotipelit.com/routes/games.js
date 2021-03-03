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
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
const express_1 = __importDefault(require("express"));
const shortid_1 = __importDefault(require("shortid"));
const mappers_1 = require("../utils/mappers");
const express_jwt_1 = __importDefault(require("express-jwt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../utils/config"));
const mongoose_1 = __importDefault(require("mongoose"));
const game_1 = __importDefault(require("../models/game"));
const word_1 = __importDefault(require("../models/word"));
const url_1 = __importDefault(require("../models/url"));
const user_1 = __importDefault(require("../models/user"));
const games_1 = __importDefault(require("../services/games"));
const mail_1 = __importDefault(require("../services/mail"));
const types_1 = require("../types");
const middleware_1 = require("../utils/middleware");
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
/** public routes */
router.put('/lock', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = mappers_1.parseString(req.body.gameId);
        const reservationId = mappers_1.parseString(req.body.reservationId);
        const displayName = mappers_1.parseString(req.body.displayName);
        const email = mappers_1.parseEmail(req.body.email);
        const game = yield game_1.default.findById(gameId);
        if (!game) {
            throw new Error('Invalid request: no game found');
        }
        const host = yield user_1.default.findById(game.host.id);
        if (!host) {
            throw new Error('Invalid request: no host found for game');
        }
        const playerReservationToLock = game.players.find((player) => {
            var _a;
            return ((_a = player.reservedFor) === null || _a === void 0 ? void 0 : _a.id) === reservationId;
        });
        if (!playerReservationToLock || !playerReservationToLock.reservedFor) {
            throw new Error(`Invalid request: no reservation found with id '${reservationId}'`);
        }
        const reservationData = playerReservationToLock.reservedFor;
        // 10 sec buffer to make sure gameservice won't set spot as null in 10 seconds to avoid race conditions
        if (reservationData.expires - 10000 < Date.now()) {
            throw new Error(`Invalid request: reservation with id '${reservationId}' has expired`);
        }
        if (reservationData.locked) {
            throw new Error(`Invalid request: reservation with id '${reservationId}' is locked`);
        }
        logger_1.default.log(`locking reservation with id ${reservationId} and setting displayName '${displayName}'`);
        const playerWithReservationLocked = Object.assign(Object.assign({}, playerReservationToLock), { name: displayName, reservedFor: Object.assign(Object.assign({}, reservationData), { locked: true }) });
        game.players = game.players.map((player) => {
            if (player.id === playerReservationToLock.id) {
                return playerWithReservationLocked;
            }
            return player;
        });
        const savedGame = yield game.save();
        res.json(playerWithReservationLocked);
        const inviteMailData = games_1.default.getInviteMailData(savedGame, playerWithReservationLocked.id, displayName, host.username);
        yield mail_1.default.sendInvite(email, inviteMailData);
    }
    catch (e) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        logger_1.default.error(`error locking spot: ${e.message}`);
        next(e);
    }
}));
router.put('/reserve', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = mappers_1.toID(req.body.gameId);
        const reservationId = mappers_1.toID(req.body.reservationId);
        yield games_1.default.refreshGameReservations(gameId);
        const expiresAt = Date.now() + 300000 + 10000; // 5 min + 10 sec buffer
        yield game_1.default.updateOne({
            _id: mongoose_1.default.Types.ObjectId(gameId),
            'players.reservedFor': null,
        }, {
            $set: {
                'players.$.reservedFor': {
                    id: reservationId,
                    expires: expiresAt,
                },
            },
        });
        const gameAfterUpdate = yield game_1.default.findById(gameId);
        if (!gameAfterUpdate) {
            throw new Error(`Unexpected error: no game found after update with id ${gameId}`);
        }
        const reservations = gameAfterUpdate.players.map((player) => player.reservedFor ? player.reservedFor.id : null);
        if (!reservations.includes(reservationId)) {
            if (reservations.indexOf(null) === -1) {
                throw new Error('Invalid request: game is full');
            }
            throw new Error('Unexpected error reserving');
        }
        const reservedPlayer = gameAfterUpdate.players.find((player) => { var _a; return ((_a = player.reservedFor) === null || _a === void 0 ? void 0 : _a.id) === reservationId; });
        if (!reservedPlayer) {
            throw new Error('Unexpected error reserving, reserved player was undefined');
        }
        logger_1.default.log('reserved a slot with id:', reservationId, 'player id:', reservedPlayer.id, 'expires at:', expiresAt);
        res.json({
            playerId: reservedPlayer.id,
            expiresAt,
        });
    }
    catch (e) {
        next(e);
    }
}));
router.get('/cancel/:hostName/:inviteCode', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostName = mappers_1.toID(req.params.hostName);
        const inviteCode = mappers_1.toID(req.params.inviteCode);
        const urlData = yield url_1.default.findOne({ hostName, inviteCode });
        if (!urlData) {
            throw new Error(`Invalid url: no game found with host name '${hostName}' and invite code '${inviteCode}'`);
        }
        const { gameId } = urlData;
        const game = yield game_1.default.findOne({ _id: gameId });
        if (!game) {
            throw new Error(`Invalid game id: no game found with id '${gameId}'`);
        }
        if (game.status === types_1.GameStatus.RUNNING ||
            game.status === types_1.GameStatus.FINISHED) {
            throw new Error(`Invalid request: game already started`);
        }
        const newInviteCode = shortid_1.default.generate();
        let inviteCodeWasUpdated = false;
        game.players = game.players.map((player) => {
            if (player.privateData.inviteCode === inviteCode) {
                inviteCodeWasUpdated = true;
                return Object.assign(Object.assign({}, player), { inviteCode: newInviteCode, reservedFor: null, name: 'Avoinna' });
            }
            return player;
        });
        if (!inviteCodeWasUpdated) {
            throw new Error(`no player found matching inviteCode ${inviteCode}`);
        }
        yield game.save();
        urlData.inviteCode = newInviteCode;
        yield urlData.save();
        logger_1.default.log(`updated inviteCode ${inviteCode} to ${newInviteCode}`);
        res.status(204).end();
    }
    catch (e) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        logger_1.default.error(`error canceling reservation: ${e.message}`);
        next(e);
    }
}));
router.get('/join/:hostName/:inviteCode', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostName = mappers_1.toID(req.params.hostName);
        const inviteCode = mappers_1.toID(req.params.inviteCode);
        const urlData = yield url_1.default.findOne({ hostName, inviteCode });
        if (!urlData) {
            throw new Error(`Invalid url: no game found with host name '${hostName}' and invite code '${inviteCode}'`);
        }
        const { gameId } = urlData;
        const game = yield game_1.default.findOne({ _id: gameId });
        const player = mappers_1.validateGamePlayer(game, inviteCode);
        const payload = {
            username: player.name,
            id: player.id,
            role: types_1.Role.PLAYER,
            gameId,
            type: 'rtc',
        };
        const token = jsonwebtoken_1.default.sign(payload, config_1.default.SECRET, { expiresIn: '10h' });
        const response = token;
        res.json(response);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/lobby/:hostName/:gameId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = mappers_1.toID(req.params.gameId);
        const hostName = mappers_1.toID(req.params.hostName);
        const game = yield games_1.default.refreshGameReservations(gameId);
        const host = yield user_1.default.findOne({ username: hostName });
        if (!host || game.host.id.toString() !== host._id.toString()) {
            throw new Error(`Invalid request: host missing or not matching fetched game`);
        }
        const response = {
            type: game.type,
            price: game.price,
            hostName: hostName,
            startTime: game.startTime,
            players: game.players.map((player) => {
                return {
                    id: player.id,
                    name: player.name,
                    reservedFor: player.reservedFor,
                };
            }),
        };
        res.json(response);
    }
    catch (e) {
        next(e);
    }
}));
/** token protected routes */
router.use(express_jwt_1.default({ secret: config_1.default.SECRET }), middleware_1.onlyForRole(types_1.Role.HOST));
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /** return all games where host id matches user token id */
    try {
        const user = mappers_1.toAuthenticatedUser(req);
        const allGames = yield game_1.default.find({});
        const filteredGames = allGames.filter((game) => game.host.id.toString() === user.id);
        res.json(filteredGames);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = mappers_1.toAuthenticatedUser(req);
        const newGame = mappers_1.toNewGame(req.body, user);
        const game = new game_1.default(Object.assign(Object.assign({}, newGame), { createDate: new Date(), info: games_1.default.getInitialInfo(newGame), players: newGame.players.map((player) => {
                return Object.assign(Object.assign({}, player), { id: shortid_1.default.generate(), reservedFor: null, privateData: Object.assign(Object.assign({}, player.privateData), { inviteCode: shortid_1.default.generate(), twilioToken: null, socketId: null }) });
            }) }));
        const savedGame = yield game.save();
        /** save short urls to database */
        for (const player of savedGame.players) {
            const urlObject = {
                playerId: player.id,
                gameId: savedGame._id.toString(),
                hostName: user.username,
                inviteCode: player.privateData.inviteCode,
            };
            const newUrl = new url_1.default(urlObject);
            yield newUrl.save();
        }
        res.json(savedGame);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/token/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = mappers_1.toID(req.params.id);
        const game = yield game_1.default.findById(gameId);
        if (!game) {
            throw new Error(`Invalid game id: ${gameId}`);
        }
        const user = mappers_1.toAuthenticatedUser(req);
        if (!user.id === game.host.id) {
            console.error('invalid host', game.host, user.id);
            throw new Error(`Invalid request: game host id and request user id not matching`);
        }
        const payload = {
            username: user.username,
            id: user.id,
            role: types_1.Role.HOST,
            gameId,
            type: 'rtc',
        };
        const token = jsonwebtoken_1.default.sign(payload, config_1.default.SECRET);
        res.json(token);
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = mappers_1.toID(req.params.id);
        const user = mappers_1.toAuthenticatedUser(req);
        const game = yield game_1.default.findById(gameId);
        const validatedGame = mappers_1.validateGameHost(game, user.id.toString());
        yield validatedGame.remove();
        res.status(204).end();
    }
    catch (error) {
        next(error);
    }
}));
/** random words */
router.get('/words/:amount', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const amount = mappers_1.toPositiveInteger(req.params.amount);
        const words = yield word_1.default.aggregate().sample(amount);
        res.json(words.map((word) => word.word));
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
