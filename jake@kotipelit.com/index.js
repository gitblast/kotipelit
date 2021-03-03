"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./app"));
const socketio_1 = __importDefault(require("./services/socketio"));
const config_1 = __importDefault(require("./utils/config"));
const logger_1 = require("./utils/logger");
console.log('setting logger debugging true in index');
logger_1.setDebug(true);
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server);
socketio_1.default(io);
server.listen(config_1.default.PORT, () => {
    console.log(`Server running on port ${config_1.default.PORT}`);
});
app_1.default.use('/*', express_1.default.static('build'));
