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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const user_1 = __importDefault(require("../models/user"));
const connection_1 = __importDefault(require("../utils/connection"));
const testHelpers_1 = __importDefault(require("../utils/testHelpers"));
const api = supertest_1.default(app_1.default);
const baseUrl = '/api/login';
describe('login router', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.default.deleteMany({});
    }));
    it('should return a token with valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testHelpers_1.default.addDummyUser('username', 'password');
        const credentials = {
            username: 'username',
            password: 'password',
        };
        const response = yield api
            .post(baseUrl)
            .send(credentials)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('username');
    }));
    it('should return 401 with invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testHelpers_1.default.addDummyUser('not', 'matching');
        const credentials = {
            username: 'username',
            password: 'password',
        };
        const response = yield api.post(baseUrl).send(credentials).expect(401);
        expect(response.error).toBeDefined();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection_1.default.close();
    }));
});
