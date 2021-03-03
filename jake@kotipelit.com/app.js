"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('express-async-errors');
const config_1 = __importDefault(require("./utils/config"));
const connection_1 = __importDefault(require("./utils/connection"));
// middleware
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
// routes
const login_1 = __importDefault(require("./routes/login"));
const users_1 = __importDefault(require("./routes/users"));
const games_1 = __importDefault(require("./routes/games"));
const xirsys_1 = __importDefault(require("./routes/xirsys"));
const app = express_1.default();
void connection_1.default.connect(config_1.default.MONGODB_URI);
// logger
if (process.env.NODE_ENV !== 'test')
    app.use(morgan_1.default('tiny'));
app.use(express_1.default.json());
app.use(cors_1.default());
app.use(express_1.default.static('build'));
// routes
app.use('/api/login', login_1.default);
app.use('/api/users', users_1.default);
app.use('/api/games', games_1.default);
app.use('/api/webrtc', xirsys_1.default);
app.use(errorHandler_1.default);
exports.default = app;
