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
/* eslint-disable @typescript-eslint/unbound-method */
const types_1 = require("../types");
const games_1 = __importDefault(require("./games"));
const game_1 = __importDefault(require("../models/game"));
jest.mock('../models/game', () => ({
    findById: jest.fn(),
    save: jest.fn(),
}));
const findById = game_1.default.findById;
describe('games service', () => {
    describe('getInitialInfo', () => {
        it('should throw error if game type invalid', () => {
            const mockGame = {
                type: 'invalid',
            };
            expect(() => games_1.default.getInitialInfo(mockGame)).toThrowError(`Invalid game type: ${mockGame.type}`);
        });
        describe('kotitonni', () => {
            it('should throw error if no players are set', () => {
                const mockGame = {
                    type: types_1.GameType.KOTITONNI,
                };
                expect(() => games_1.default.getInitialInfo(mockGame)).toThrowError('Game has no players set');
                expect(() => games_1.default.getInitialInfo(Object.assign(Object.assign({}, mockGame), { players: [] }))).toThrowError('Game has no players set');
            });
            it('should return initial info object', () => {
                const mockPlayer = {
                    id: 'mockPlayer ID',
                };
                const mockGame = {
                    type: types_1.GameType.KOTITONNI,
                    players: [mockPlayer],
                };
                const expectedInfo = {
                    round: 1,
                    turn: mockPlayer.id,
                    answeringOpen: false,
                };
                expect(games_1.default.getInitialInfo(mockGame)).toEqual(expectedInfo);
            });
        });
    });
    describe('getGameById', () => {
        it('should call findById', () => __awaiter(void 0, void 0, void 0, function* () {
            findById.mockResolvedValueOnce({});
            yield games_1.default.getGameById('id');
            expect(findById).toHaveBeenCalledWith('id');
        }));
        it('should throw error if game not found', () => __awaiter(void 0, void 0, void 0, function* () {
            findById.mockImplementationOnce(() => null);
            const id = 'ID';
            try {
                yield games_1.default.getGameById(id);
            }
            catch (e) {
                expect(e.message).toBe(`No game found with id ${id}`);
            }
        }));
        it('should return game if found', () => __awaiter(void 0, void 0, void 0, function* () {
            const game = {};
            findById.mockResolvedValueOnce(game);
            const returnedGame = yield games_1.default.getGameById('id');
            expect(returnedGame).toBe(game);
        }));
    });
    describe('saveFinishedGame', () => {
        it('should throw error if game not found', () => __awaiter(void 0, void 0, void 0, function* () {
            findById.mockImplementationOnce(() => null);
            const id = 'ID';
            try {
                yield games_1.default.getGameById(id);
            }
            catch (e) {
                expect(e.message).toBe(`No game found with id ${id}`);
            }
        }));
        it('should replace players and status and call save', () => __awaiter(void 0, void 0, void 0, function* () {
            const initialPlayers = {};
            const mockReturn = {
                players: initialPlayers,
                save: jest.fn(),
                status: 'initial',
            };
            const origGame = {
                players: {},
            };
            findById.mockImplementationOnce(() => mockReturn);
            yield games_1.default.saveFinishedGame('id', origGame);
            expect(mockReturn.players).toBe(origGame.players);
            expect(mockReturn.status).toBe(types_1.GameStatus.FINISHED);
            expect(mockReturn.save).toHaveBeenCalledTimes(1);
        }));
    });
    describe('setGameStatus', () => {
        it('should throw error if game not found', () => __awaiter(void 0, void 0, void 0, function* () {
            findById.mockImplementationOnce(() => null);
            const id = 'ID';
            try {
                yield games_1.default.getGameById(id);
            }
            catch (e) {
                expect(e.message).toBe(`No game found with id ${id}`);
            }
        }));
        it('should set new status and call save', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockReturn = {
                save: jest.fn(),
                status: 'initial',
            };
            findById.mockImplementationOnce(() => mockReturn);
            const expectedReturn = {};
            mockReturn.save.mockResolvedValueOnce(expectedReturn);
            const randomStatus = Date.now().toString();
            const actualReturn = yield games_1.default.setGameStatus('id', randomStatus);
            expect(mockReturn.status).toBe(randomStatus);
            expect(mockReturn.save).toHaveBeenCalledTimes(1);
            expect(actualReturn).toBe(expectedReturn);
        }));
    });
});
