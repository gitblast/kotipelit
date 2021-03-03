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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../types");
const gameSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    info: { type: Object, required: true },
    startTime: { type: Date, required: true },
    players: { type: Array, required: true },
    status: { type: types_1.GameStatus, required: true },
    host: {
        id: { type: mongoose_1.default.Types.ObjectId, required: true },
        displayName: { type: String, required: true },
        privateData: {
            socketId: { type: String },
            twilioToken: { type: String },
        },
    },
    createDate: { type: Date, required: true },
    rounds: Number,
    price: { type: Number, required: true },
}, { minimize: false }); // minimize omits empty objects (causes errors in kotitonni answers)
gameSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = mongoose_1.default.model('Game', gameSchema);
