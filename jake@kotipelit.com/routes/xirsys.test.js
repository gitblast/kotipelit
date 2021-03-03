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
const axios_1 = __importDefault(require("axios"));
const connection_1 = __importDefault(require("../utils/connection"));
const config_1 = __importDefault(require("../utils/config"));
const testHelpers_1 = __importDefault(require("../utils/testHelpers"));
const types_1 = require("../types");
jest.mock('../utils/config');
jest.mock('axios');
const api = supertest_1.default(app_1.default);
const baseUrl = '/api/webrtc';
const mockResponse = {
    data: 'testing',
};
const mockedAxios = axios_1.default;
mockedAxios.put.mockResolvedValue(mockResponse);
describe('xirsys router', () => {
    it('should throw 401 without token', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api.get(baseUrl).expect(401);
    }));
    it('should send a put request to xirsys with correct credentials and token', () => __awaiter(void 0, void 0, void 0, function* () {
        const token = testHelpers_1.default.getValidToken({
            _id: 'testID',
            username: 'testUsername',
        }, config_1.default.SECRET, types_1.Role.PLAYER);
        const response = yield api
            .get(baseUrl)
            .set('Authorization', `bearer ${token}`)
            .expect(200);
        expect(response.body).toBe(mockResponse.data);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(mockedAxios.put).toHaveBeenLastCalledWith(config_1.default.XIRSYS_URL, {
            expire: '7200',
            format: 'urls',
        }, {
            headers: {
                Authorization: 'Basic ' + Buffer.from(config_1.default.XIRSYS_SECRET).toString('base64'),
            },
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection_1.default.close();
    }));
});
