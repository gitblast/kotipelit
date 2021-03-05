"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
const socketio_jwt_1 = require("@thream/socketio-jwt");
const config_1 = __importDefault(require("../../utils/config"));
const logger_1 = __importDefault(require("../../utils/logger"));
const callbacks = __importStar(require("./socketio.callbacks"));
const types_1 = require("../../types");
const attachRTCListeners = (socket) => {
    logger_1.default.log('attaching listeners');
    // can handle game types here
    socket.on('join-room', () => {
        void callbacks.joinRTCRoom(socket);
    });
    socket.on('get-room-game', () => {
        void callbacks.getRoomGame(socket);
    });
    socket.on('answer', (answerObj) => {
        void callbacks.handleAnswer(socket, answerObj);
    });
    socket.on('disconnect', (reason) => {
        void callbacks.socketDisconnected(socket, reason);
    });
    socket.on('leave-room', () => {
        void callbacks.leaveRTCRoom(socket);
    });
    if (socket.decodedToken.role === types_1.Role.HOST) {
        socket.on('launch', () => {
            void callbacks.launchRTCGame(socket);
        });
        socket.on('start', () => {
            void callbacks.startRTCGame(socket);
        });
        socket.on('end', () => {
            void callbacks.endRTCGame(socket);
        });
        socket.on('update-game', (game) => {
            void callbacks.updateRTCGame(socket, game);
        });
        socket.on('timer', (value) => {
            void callbacks.handleTimerChange(socket, value);
        });
    }
};
const handler = (io) => {
    // authenticate
    io.of('/').use(socketio_jwt_1.authorize({
        secret: config_1.default.SECRET,
    }));
    io.of('/').on('connection', (socket) => {
        logger_1.default.log(`user connected ${socket.decodedToken.username}`);
        const { type, gameId } = socket.decodedToken;
        if (type === 'rtc') {
            logger_1.default.log(`joining channel ${gameId}`);
            socket.join(gameId);
            attachRTCListeners(socket);
        }
        else {
            logger_1.default.error('socket type not recognized');
        }
    });
};
exports.default = handler;
