"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = __importDefault(require("twilio"));
const config_1 = __importDefault(require("../utils/config"));
const getVideoAccessToken = (identity, roomName) => {
    const AccessToken = twilio_1.default.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;
    const token = new AccessToken(config_1.default.TWILIO_ACCOUNT_SID, config_1.default.TWILIO_API_KEY, config_1.default.TWILIO_API_SECRET);
    token.identity = identity;
    const grant = new VideoGrant({ room: roomName });
    token.addGrant(grant);
    return token.toJwt();
};
exports.default = {
    getVideoAccessToken,
};
