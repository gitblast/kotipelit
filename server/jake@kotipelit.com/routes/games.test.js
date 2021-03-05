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
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = __importDefault(require("../app"));
const config_1 = __importDefault(require("../utils/config"));
const game_1 = __importDefault(require("../models/game"));
const connection_1 = __importDefault(require("../utils/connection"));
const testHelpers_1 = __importDefault(require("../utils/testHelpers"));
const mail_1 = __importDefault(require("../services/mail"));
const types_1 = require("../types");
const word_1 = __importDefault(require("../models/word"));
const url_1 = __importDefault(require("../models/url"));
const user_1 = __importDefault(require("../models/user"));
jest.mock('../services/mail', () => ({ sendInvite: jest.fn() }));
const mailerMock = mail_1.default.sendInvite;
mailerMock.mockResolvedValue({});
const api = supertest_1.default(app_1.default);
const baseUrl = '/api/games';
const dummyGame = {
    type: types_1.GameType.KOTITONNI,
    price: 10,
    players: [
        {
            id: 'id1',
            name: 'player1',
            points: 0,
            reservedFor: null,
            privateData: {
                answers: {},
                words: [],
                twilioToken: null,
                inviteCode: 'player1invite',
                socketId: null,
            },
        },
        {
            id: 'id2',
            name: 'player2',
            points: 0,
            privateData: {
                answers: {},
                words: [],
                socketId: null,
                inviteCode: 'player2invite',
                twilioToken: null,
            },
            reservedFor: null,
        },
    ],
    startTime: new Date(),
    status: types_1.GameStatus.UPCOMING,
    rounds: 3,
};
let user;
let token;
let game;
let gameId;
describe('games router', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield game_1.default.deleteMany({});
        yield url_1.default.deleteMany({});
        yield user_1.default.deleteMany({});
        user = yield testHelpers_1.default.addDummyUser();
        token = testHelpers_1.default.getValidToken(user, config_1.default.SECRET, types_1.Role.HOST);
        game = yield testHelpers_1.default.addDummyGame(user);
        gameId = game._id.toString();
    }));
    it('should return 401 without valid token on protected routes', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.post(baseUrl).send(dummyGame).expect(401);
        yield api.get(baseUrl).expect(401);
        yield api.delete(`${baseUrl}/id`).expect(401);
        yield api.get(`${baseUrl}/words/1`).expect(401);
        const invalidToken = testHelpers_1.default.getValidToken(user, config_1.default.SECRET, types_1.Role.PLAYER);
        yield api
            .post(baseUrl)
            .set('Authorization', `bearer ${invalidToken}`)
            .send(dummyGame)
            .expect(401);
        yield api
            .get(baseUrl)
            .set('Authorization', `bearer ${invalidToken}`)
            .expect(401);
        yield api
            .delete(`${baseUrl}/id`)
            .set('Authorization', `bearer ${invalidToken}`)
            .expect(401);
        yield api
            .get(`${baseUrl}/words/1`)
            .set('Authorization', `bearer ${invalidToken}`)
            .expect(401);
    }));
    describe('GET /lobby/:hostName/:gameId', () => {
        it('should throw error if no game is found or if status is not upcoming', () => __awaiter(void 0, void 0, void 0, function* () {
            const hostName = user.username;
            expect(game.status).toBe(types_1.GameStatus.UPCOMING);
            yield api.get(`${baseUrl}/lobby/${hostName}/invalidID`).expect(400);
            game.status = types_1.GameStatus.WAITING;
            yield game.save();
            yield api.get(`${baseUrl}/lobby/${hostName}/${gameId}`).expect(400);
        }));
        it('should throw error if host not found or not matching game host', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api.get(`${baseUrl}/lobby/INVALID_FOR_TESTS/${gameId}`).expect(400);
            const newUser = yield testHelpers_1.default.addDummyUser('DIFFERENT USERNAME');
            yield api
                .get(`${baseUrl}/lobby/${newUser.username}/${gameId}`)
                .expect(400);
        }));
        it('should return game type, price, hostname and starttime and locked player names if no errors', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            game.players = game.players.map((player, index) => {
                return index === 0
                    ? Object.assign(Object.assign({}, player), { reservedFor: {
                            id: 'reservation id',
                            expires: Date.now() * 2,
                            locked: true,
                        } }) : player;
            });
            yield game.save();
            const response = yield api
                .get(`${baseUrl}/lobby/${user.username}/${gameId}`)
                .expect(200);
            expect(response.body.type).toBe(game.type);
            expect(response.body.price).toBe(game.price);
            expect(response.body.hostName).toBe(user.username);
            expect(new Date(response.body.startTime)).toEqual(game.startTime);
            (_a = response.body.players) === null || _a === void 0 ? void 0 : _a.forEach((player, index) => {
                var _a, _b, _c;
                if (index === 0) {
                    expect(player.name).toBe(game.players[0].name);
                    expect(player.id).toBe(game.players[0].id);
                    expect((_a = player.reservedFor) === null || _a === void 0 ? void 0 : _a.expires).toBe((_b = game.players[0].reservedFor) === null || _b === void 0 ? void 0 : _b.expires);
                    expect(player.reservedFor.locked).toBe((_c = game.players[0].reservedFor) === null || _c === void 0 ? void 0 : _c.locked);
                }
                else {
                    expect(player.reservedFor).toBeNull();
                }
            });
        }));
    });
    describe('PUT /lock', () => {
        let lockReqBody;
        beforeEach(() => {
            lockReqBody = {
                gameId,
                reservationId: 'INVALID_reservation',
                displayName: 'TestDisplayName',
                email: 'testEmailAddress@validish.io',
            };
        });
        it('should throw error if no game found', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api
                .put(`${baseUrl}/lock`)
                .send({
                gameId: 'INVALID',
                reservationId: 'reservation',
            })
                .expect(400);
        }));
        it('should throw error if no reservation found', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api.put(`${baseUrl}/lock`).send(lockReqBody).expect(400);
        }));
        it('should throw error if reservation has expired', () => __awaiter(void 0, void 0, void 0, function* () {
            const reservation = {
                id: lockReqBody.reservationId,
                expires: Date.now() - 100000,
                locked: false,
            };
            game.players = game.players.map((player, index) => {
                return index === 0
                    ? Object.assign(Object.assign({}, player), { reservedFor: reservation }) : player;
            });
            yield game.save();
            yield api.put(`${baseUrl}/lock`).send(lockReqBody).expect(400);
        }));
        it('should throw error if reservation is locked', () => __awaiter(void 0, void 0, void 0, function* () {
            const reservation = {
                id: lockReqBody.reservationId,
                expires: Date.now() * 2,
                locked: true,
            };
            game.players = game.players.map((player, index) => {
                return index === 0
                    ? Object.assign(Object.assign({}, player), { reservedFor: reservation }) : player;
            });
            yield game.save();
            yield api.put(`${baseUrl}/lock`).send(lockReqBody).expect(400);
        }));
        it('should lock reservation if everything is ok', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const reservation = {
                id: lockReqBody.reservationId,
                expires: Date.now() * 2,
                locked: false,
            };
            game.players = game.players.map((player, index) => {
                return index === 0
                    ? Object.assign(Object.assign({}, player), { reservedFor: reservation }) : player;
            });
            yield game.save();
            const response = yield api
                .put(`${baseUrl}/lock`)
                .send(lockReqBody)
                .expect(200);
            expect((_a = response.body.reservedFor) === null || _a === void 0 ? void 0 : _a.id).toBe(lockReqBody.reservationId);
            expect((_b = response.body.reservedFor) === null || _b === void 0 ? void 0 : _b.locked).toBe(true);
            expect(response.body.name).toBe(lockReqBody.displayName);
            expect(mailerMock).toHaveBeenLastCalledWith(lockReqBody.email, expect.any(Object));
        }));
    });
    describe('PUT /reserve ', () => {
        it('should set reservation if available slots exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const reservations = game.players.map((p) => p.reservedFor ? p.reservedFor.id : null);
            const reqBody = {
                gameId,
                reservationId: 'TEST_ID',
            };
            expect(reservations.indexOf(reqBody.reservationId)).toBe(-1);
            yield api.put(`${baseUrl}/reserve`).send(reqBody).expect(200);
            const gameNow = yield game_1.default.findById(gameId);
            const reservationsNow = gameNow === null || gameNow === void 0 ? void 0 : gameNow.players.map((player) => player.reservedFor ? player.reservedFor.id : null);
            expect(reservationsNow === null || reservationsNow === void 0 ? void 0 : reservationsNow.indexOf(reqBody.reservationId)).not.toBe(-1);
        }));
        it('should set reservation if expired, non locked reservation slots exist', () => __awaiter(void 0, void 0, void 0, function* () {
            game.players = game.players.map((player, index) => (Object.assign(Object.assign({}, player), { reservedFor: {
                    id: `reservation ${index}`,
                    expires: Date.now() - 1000,
                    locked: index !== 0,
                } })));
            yield game.save();
            const reservations = game.players.map((p) => p.reservedFor ? p.reservedFor.id : null);
            const reqBody = {
                gameId,
                reservationId: 'TEST_ID',
            };
            expect(reservations.indexOf(null)).toBe(-1);
            expect(reservations.indexOf(reqBody.reservationId)).toBe(-1);
            yield api.put(`${baseUrl}/reserve`).send(reqBody).expect(200);
            const gameNow = yield game_1.default.findById(gameId);
            const reservationsNow = gameNow === null || gameNow === void 0 ? void 0 : gameNow.players.map((p) => p.reservedFor ? p.reservedFor.id : null);
            expect(reservationsNow === null || reservationsNow === void 0 ? void 0 : reservationsNow.indexOf(null)).toBe(-1);
            expect(reservationsNow === null || reservationsNow === void 0 ? void 0 : reservationsNow.indexOf(reqBody.reservationId)).not.toBe(-1);
        }));
        it('should throw 400 if reservation fails', () => __awaiter(void 0, void 0, void 0, function* () {
            game.players = game.players.map((player, index) => (Object.assign(Object.assign({}, player), { reservedFor: {
                    id: `reservation ${index}`,
                    expires: Date.now() * 2,
                } })));
            yield game.save();
            const reservations = game.players.map((p) => p.reservedFor ? p.reservedFor.id : null);
            const reqBody = {
                gameId,
                reservationId: 'TEST_ID',
            };
            expect(reservations.indexOf(null)).toBe(-1);
            expect(reservations.indexOf(reqBody.reservationId)).toBe(-1);
            yield api.put(`${baseUrl}/reserve`).send(reqBody).expect(400);
            const gameNow = yield game_1.default.findById(gameId);
            const reservationsNow = gameNow === null || gameNow === void 0 ? void 0 : gameNow.players.map((p) => p.reservedFor ? p.reservedFor.id : null);
            expect(reservationsNow === null || reservationsNow === void 0 ? void 0 : reservationsNow.indexOf(null)).toBe(-1);
            expect(reservationsNow === null || reservationsNow === void 0 ? void 0 : reservationsNow.indexOf(reqBody.reservationId)).toBe(-1);
        }));
    });
    describe('GET /join/:hostName/:inviteCode', () => {
        it('should return token with valid parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const player = game.players[0];
            const hostName = user.username;
            if (!player.privateData.inviteCode) {
                throw new Error('Player inviteCode was not set, check helper');
            }
            const response = yield api
                .get(`${baseUrl}/join/${hostName}/${player.privateData.inviteCode}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);
            const expectedPayload = {
                exp: expect.any(Number),
                username: player.name,
                id: player.id,
                gameId: gameId,
                type: 'rtc',
                role: types_1.Role.PLAYER,
            };
            const decodedToken = jsonwebtoken_1.default.verify(response.body, config_1.default.SECRET);
            // remove iat field
            delete decodedToken.iat;
            expect(decodedToken).toEqual(expectedPayload);
        }));
        it('should return 400 with invalid host name or player id', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api
                .get(`${baseUrl}/join/${user.username}/INCORRECT_ID`)
                .expect(400);
            yield api
                .get(`${baseUrl}/join/INVALID_HOST/${game.players[0].id}`)
                .expect(400);
        }));
    });
    describe('GET /', () => {
        it('should return only games added by host matching with token', () => __awaiter(void 0, void 0, void 0, function* () {
            const anotherUser = yield testHelpers_1.default.addDummyUser();
            const initialGames = yield testHelpers_1.default.gamesInDb();
            yield testHelpers_1.default.addDummyGame(anotherUser);
            yield testHelpers_1.default.addDummyGame(anotherUser);
            yield testHelpers_1.default.addDummyGame(user);
            yield testHelpers_1.default.addDummyGame(user);
            const gamesAtEnd = yield testHelpers_1.default.gamesInDb();
            expect(gamesAtEnd.length).toBe(initialGames.length + 4);
            const response = yield api
                .get(baseUrl)
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);
            expect(response.body).toBeDefined();
            expect(response.body.length).toBe(initialGames.length + 2);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            response.body.forEach((game) => {
                expect(game.host.id).toBe(user._id.toString());
            });
        }));
    });
    describe('POST /', () => {
        it('should add a valid game with valid token', () => __awaiter(void 0, void 0, void 0, function* () {
            const initialGames = yield testHelpers_1.default.gamesInDb();
            const newGame = Object.assign({}, dummyGame);
            const response = yield api
                .post(baseUrl)
                .send(newGame)
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);
            const gamesAtEnd = yield testHelpers_1.default.gamesInDb();
            expect(gamesAtEnd.length).toBe(initialGames.length + 1);
            expect(response.body).toBeDefined();
            expect(response.body).toHaveProperty('createDate');
            expect(response.body).toHaveProperty('id');
        }));
        it('should add token id as host id when adding new game', () => __awaiter(void 0, void 0, void 0, function* () {
            const id = user._id;
            const response = yield api
                .post(baseUrl)
                .send(dummyGame)
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);
            expect(response.body).toBeDefined();
            expect(response.body).toHaveProperty('host');
            expect(response.body.host.id).toBe(id.toString());
        }));
        it('should return 400 with invalid game object using valid token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api
                .post(baseUrl)
                .send(Object.assign(Object.assign({}, dummyGame), { players: undefined }))
                .set('Authorization', `bearer ${token}`)
                .expect(400);
            yield api
                .post(baseUrl)
                .send(Object.assign(Object.assign({}, dummyGame), { type: undefined }))
                .set('Authorization', `bearer ${token}`)
                .expect(400);
            yield api
                .post(baseUrl)
                .send(Object.assign(Object.assign({}, dummyGame), { startTime: undefined }))
                .set('Authorization', `bearer ${token}`)
                .expect(400);
        }));
    });
    describe('DELETE /:id', () => {
        it('should allow deleting games added by id matching token', () => __awaiter(void 0, void 0, void 0, function* () {
            const initialGames = yield testHelpers_1.default.gamesInDb();
            const newGame = yield testHelpers_1.default.addDummyGame(user);
            const tempGames = yield testHelpers_1.default.gamesInDb();
            expect(tempGames.length).toBe(initialGames.length + 1);
            const newGameId = newGame._id.toString();
            yield api
                .delete(`${baseUrl}/${newGameId}`)
                .set('Authorization', `bearer ${token}`)
                .expect(204);
            const gamesAfterDelete = yield testHelpers_1.default.gamesInDb();
            expect(gamesAfterDelete.length).toBe(tempGames.length - 1);
        }));
        it('should not allow deleting games added by others', () => __awaiter(void 0, void 0, void 0, function* () {
            const anotherUser = yield testHelpers_1.default.addDummyUser();
            const anotherGame = yield testHelpers_1.default.addDummyGame(anotherUser);
            const anotherId = anotherGame._id.toString();
            const gamesAfterAdd = yield testHelpers_1.default.gamesInDb();
            yield api
                .delete(`${baseUrl}/${anotherId}`)
                .set('Authorization', `bearer ${token}`)
                .expect(400);
            const gamesAfterDelete = yield testHelpers_1.default.gamesInDb();
            expect(gamesAfterDelete).toEqual(gamesAfterAdd);
        }));
    });
    describe('GET /words/:amount', () => {
        const sample = ['word1', 'word2', 'word3', 'word4', 'word5'];
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield word_1.default.deleteMany({});
            yield testHelpers_1.default.addDummyWords(sample);
        }));
        it('should start testing with 5 words in db', () => __awaiter(void 0, void 0, void 0, function* () {
            const wordsInDb = yield word_1.default.find({});
            expect(wordsInDb.length).toBe(5);
        }));
        it('should return 400 with non positive or non integer param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api
                .get(`${baseUrl}/words/0`)
                .set('Authorization', `bearer ${token}`)
                .expect(400);
            yield api
                .get(`${baseUrl}/words/1.1`)
                .set('Authorization', `bearer ${token}`)
                .expect(400);
            yield api
                .get(`${baseUrl}/words/-1`)
                .set('Authorization', `bearer ${token}`)
                .expect(400);
        }));
        it('should return an array of words with length given as parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            const response1 = yield api
                .get(`${baseUrl}/words/1`)
                .set('Authorization', `bearer ${token}`)
                .expect(200);
            expect(Array.isArray(response1.body)).toBe(true);
            expect(response1.body.length).toBe(1);
            const response2 = yield api
                .get(`${baseUrl}/words/3`)
                .set('Authorization', `bearer ${token}`)
                .expect(200);
            expect(Array.isArray(response2.body)).toBe(true);
            expect(response2.body.length).toBe(3);
            const response3 = yield api
                .get(`${baseUrl}/words/5`)
                .set('Authorization', `bearer ${token}`)
                .expect(200);
            expect(Array.isArray(response3.body)).toBe(true);
            expect(response3.body.length).toBe(5);
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection_1.default.close();
    }));
});
