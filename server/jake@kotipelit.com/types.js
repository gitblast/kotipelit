"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.GameType = exports.GameStatus = void 0;
var GameStatus;
(function (GameStatus) {
    GameStatus["RUNNING"] = "Running";
    GameStatus["WAITING"] = "Waiting for players";
    GameStatus["UPCOMING"] = "Upcoming";
    GameStatus["FINISHED"] = "Finished";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
var GameType;
(function (GameType) {
    GameType["KOTITONNI"] = "kotitonni";
})(GameType = exports.GameType || (exports.GameType = {}));
var Role;
(function (Role) {
    Role["HOST"] = "HOST";
    Role["PLAYER"] = "PLAYER";
})(Role = exports.Role || (exports.Role = {}));
