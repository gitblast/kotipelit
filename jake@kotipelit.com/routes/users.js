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
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_jwt_1 = __importDefault(require("express-jwt"));
const config_1 = __importDefault(require("../utils/config"));
const user_1 = __importDefault(require("../models/user"));
const mappers_1 = require("../utils/mappers");
const router = express_1.default.Router();
router.get('/', (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield user_1.default.find({});
        res.json(allUsers);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/', express_jwt_1.default({ secret: config_1.default.ADMIN_SECRET }), // only with admin token
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = mappers_1.toNewUser(req.body);
        const passwordHash = yield bcryptjs_1.default.hash(newUser.password, 10);
        const user = new user_1.default({
            username: newUser.username,
            email: newUser.email,
            channelName: newUser.channelName,
            passwordHash,
            joinDate: new Date(),
        });
        const savedUser = yield user.save();
        res.json(savedUser);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
