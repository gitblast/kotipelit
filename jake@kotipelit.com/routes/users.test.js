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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const config_1 = __importDefault(require("../utils/config"));
const user_1 = __importDefault(require("../models/user"));
const connection_1 = __importDefault(require("../utils/connection"));
const testHelpers_1 = __importDefault(require("../utils/testHelpers"));
const api = supertest_1.default(app_1.default);
const types_1 = require("../types");
const baseUrl = '/api/users';
const dummy = {
    username: 'user',
    password: 'pass',
    email: 'email',
    channelName: 'channel',
};
let adminToken;
describe('user router', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield testHelpers_1.default.addDummyUser();
        adminToken = testHelpers_1.default.getValidToken(user, config_1.default.ADMIN_SECRET, types_1.Role.HOST);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.default.deleteMany({});
    }));
    it('should return 401 without valid admin token', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield testHelpers_1.default.addDummyUser();
        const hostToken = testHelpers_1.default.getValidToken(user, config_1.default.SECRET, types_1.Role.HOST);
        yield api.post(baseUrl).send(dummy).expect(401);
        yield api
            .post(baseUrl)
            .send(dummy)
            .set('Authorization', `bearer ${hostToken}`)
            .expect(401);
    }));
    it('should add a valid user with valid admin token', () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = Object.assign({}, dummy);
        const initialUsers = yield testHelpers_1.default.usersInDb();
        yield api
            .post(baseUrl)
            .send(newUser)
            .set('Authorization', `bearer ${adminToken}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        const usersAtEnd = yield testHelpers_1.default.usersInDb();
        expect(usersAtEnd.length).toBe(initialUsers.length + 1);
        expect(usersAtEnd.map((user) => user.username)).toContain(newUser.username);
    }));
    it('should not add duplicate usernames or emails with valid admin token', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testHelpers_1.default.addDummyUser(dummy.username, dummy.email);
        const uniqueUser = {
            username: Date.now.toString(),
            email: Date.now.toString(),
        };
        yield api
            .post(baseUrl)
            .send(Object.assign(Object.assign({}, uniqueUser), { username: dummy.username }))
            .set('Authorization', `bearer ${adminToken}`)
            .expect(400);
        yield api
            .post(baseUrl)
            .send(Object.assign(Object.assign({}, uniqueUser), { email: dummy.email }))
            .set('Authorization', `bearer ${adminToken}`)
            .expect(400);
    }));
    it('should return all users as json', () => __awaiter(void 0, void 0, void 0, function* () {
        const beforeAdd = yield testHelpers_1.default.usersInDb();
        yield testHelpers_1.default.addDummyUser();
        yield testHelpers_1.default.addDummyUser();
        yield testHelpers_1.default.addDummyUser();
        const response = yield api
            .get(baseUrl)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        const afterAdd = yield testHelpers_1.default.usersInDb();
        expect(afterAdd.length).toBe(beforeAdd.length + 3);
        expect(response.body).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.body.forEach((channel) => {
            expect(channel).not.toHaveProperty('passwordHash');
            expect(channel).not.toHaveProperty('email');
        });
    }));
    it('should return 400 with invalid user objects using valid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const noUsername = Object.assign(Object.assign({}, dummy), { username: undefined });
        const noPassword = Object.assign(Object.assign({}, dummy), { password: undefined });
        const noEmail = Object.assign(Object.assign({}, dummy), { email: undefined });
        const noChannelName = Object.assign(Object.assign({}, dummy), { password: undefined });
        yield api
            .post(baseUrl)
            .send(noUsername)
            .set('Authorization', `bearer ${adminToken}`)
            .expect(400);
        yield api
            .post(baseUrl)
            .send(noPassword)
            .set('Authorization', `bearer ${adminToken}`)
            .expect(400);
        yield api
            .post(baseUrl)
            .send(noEmail)
            .set('Authorization', `bearer ${adminToken}`)
            .expect(400);
        yield api
            .post(baseUrl)
            .send(noChannelName)
            .set('Authorization', `bearer ${adminToken}`)
            .expect(400);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection_1.default.close();
    }));
});
