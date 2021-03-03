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
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../utils/config"));
const mappers_1 = require("../utils/mappers");
const user_1 = __importDefault(require("../models/user"));
const types_1 = require("../types");
const router = express_1.default.Router();
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = mappers_1.toCredentials(req.body);
        const user = yield user_1.default.findOne({ username });
        const pwCorrect = user === null ? false : yield bcryptjs_1.default.compare(password, user.passwordHash);
        if (!user || !pwCorrect)
            throw new Error('Invalid username or password');
        const userForToken = {
            username,
            id: user._id.toString(),
            role: types_1.Role.HOST,
        };
        const token = jsonwebtoken_1.default.sign(userForToken, config_1.default.SECRET);
        res.json({ token, username });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
