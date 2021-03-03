"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rtcrooms_1 = __importDefault(require("./rtcrooms"));
describe('rtc rooms', () => {
    it('should init with empty rooms', () => {
        const rooms = rtcrooms_1.default.getRooms();
        expect(rooms.size).toBe(0);
    });
});
