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
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../utils/config"));
const express_jwt_1 = __importDefault(require("express-jwt"));
const router = express_1.default.Router();
router.use(express_jwt_1.default({ secret: config_1.default.SECRET }));
// sends secure requests to fetch xirsys ICE server list
router.get('/', (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqConfig = {
            headers: {
                Authorization: 'Basic ' + Buffer.from(config_1.default.XIRSYS_SECRET).toString('base64'),
            },
        };
        const body = {
            format: 'urls',
            expire: '7200',
        };
        const response = yield axios_1.default.put(config_1.default.XIRSYS_URL, body, reqConfig);
        res.json(response.data);
    }
    catch (e) {
        next(e);
    }
}));
exports.default = router;
