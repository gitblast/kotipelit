"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const http_1 = __importDefault(require("http"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socket_io_1 = require("socket.io");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const ioService = __importStar(require("."));
const config_1 = __importDefault(require("../../utils/config"));
const testHelpers_1 = __importDefault(require("../../utils/testHelpers"));
let ioServer;
let httpServer;
let httpServerAddr;
let socket;
let path;
let options;
describe('socket.io', () => {
    beforeAll(() => {
        httpServer = http_1.default.createServer().listen();
        const addr = httpServer.address();
        if (!addr || typeof addr === 'string')
            throw new Error('incorrect address type');
        httpServerAddr = addr;
        const optionsObj = testHelpers_1.default.getSocketIOParams(httpServerAddr.address, httpServerAddr.port.toString());
        path = optionsObj.path;
        options = optionsObj.options;
        ioServer = new socket_io_1.Server(httpServer);
        ioService.default(ioServer);
    });
    afterAll(() => {
        ioServer.close();
        httpServer.close();
        socket.close();
    });
    describe('authenticateSocket', () => {
        it('should not connect without a valid token', (done) => {
            socket = socket_io_client_1.default(path, Object.assign(Object.assign({}, options), { extraHeaders: { Authorization: 'INVALID TOKEN' } }));
            socket.once('connect', () => {
                fail('expect to not connect');
            });
            socket.on('connect_error', (error) => {
                expect(error.data.type).toBe('UnauthorizedError');
                done();
            });
        });
    });
    it('should connect with a valid token', (done) => {
        const token = jsonwebtoken_1.default.sign({ test: true }, config_1.default.SECRET);
        socket = socket_io_client_1.default(path, Object.assign(Object.assign({}, options), { extraHeaders: { Authorization: `Bearer ${token}` } }));
        socket.once('connect_error', (error) => {
            console.log('connection error:', error.message);
            fail('expected to succeed');
        });
        socket.once('connect', () => {
            done();
        });
    });
});
