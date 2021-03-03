"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = exports.toError = exports.toID = exports.validateGamePlayer = exports.validateGameHost = exports.toCredentials = exports.toAuthenticatedUser = exports.toPositiveInteger = exports.toNewGame = exports.toNewUser = exports.parseEmail = exports.parseString = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
const types_1 = require("../types");
const mongoose_1 = require("mongoose");
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const isError = (object) => {
    return isString(object.name) && isString(object.message);
};
const isGameType = (text) => {
    // additional games here
    return Object.values(types_1.GameType).includes(text);
};
const isDate = (date) => {
    if (!isString(date))
        return false;
    return Boolean(Date.parse(date));
};
const isArray = (obj) => {
    return Array.isArray(obj);
};
const isGamePlayer = (player) => {
    return (player.id && player.name && isString(player.id) && isString(player.name));
};
const isGameStatus = (status) => {
    return Object.values(types_1.GameStatus).includes(status);
};
const isNumber = (number) => {
    const casted = Number(number);
    if (isNaN(casted)) {
        return false;
    }
    return true;
};
exports.parseString = (str, fieldName) => {
    if (!str) {
        const errorMsg = 'Missing string to be parsed';
        throw new mongoose_1.Error(fieldName ? `Missing field '${fieldName}'` : errorMsg);
    }
    if (!isString(str))
        throw new mongoose_1.Error(fieldName
            ? `Incorrect field ${fieldName}. Expected string, got ${typeof str}`
            : 'Object is not a string');
    return str;
};
const parseGameType = (type) => {
    if (!type)
        throw new mongoose_1.Error('Missing gametype');
    if (!isGameType(type))
        throw new mongoose_1.Error('Invalid gametype');
    return type;
};
const parseDate = (date) => {
    if (!date)
        throw new mongoose_1.Error('Missing date');
    if (!isDate(date))
        throw new mongoose_1.Error('Invalid date');
    return date;
};
const parseStatus = (status) => {
    if (!status)
        throw new mongoose_1.Error('Missing game status');
    if (!isString(status) || !isGameStatus(status))
        throw new mongoose_1.Error('Missing game status');
    return status;
};
const parseRounds = (rounds) => {
    if (!rounds)
        throw new mongoose_1.Error('Missing rounds');
    if (!isNumber(rounds))
        throw new mongoose_1.Error('Invalid rounds');
    return Number(rounds);
};
const parseNumber = (number) => {
    if (number === undefined || number === null) {
        throw new mongoose_1.Error('Missing number');
    }
    if (!isNumber(number)) {
        throw new mongoose_1.Error('Invalid number');
    }
    return Number(number);
};
exports.parseEmail = (email) => {
    if (!email || !isString(email)) {
        throw new mongoose_1.Error('Invalid or missing email');
    }
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.exec(email)) {
        throw new mongoose_1.Error('Invalid email');
    }
    return email;
};
const parsePlayers = (players) => {
    if (!players)
        throw new mongoose_1.Error('Missing players');
    if (!isArray(players))
        throw new mongoose_1.Error('Invalid players');
    players.forEach((player) => {
        if (!isGamePlayer(player))
            throw new mongoose_1.Error('Invalid player');
    });
    return players;
};
exports.toNewUser = (object) => {
    return {
        username: exports.parseString(object.username, 'username'),
        password: exports.parseString(object.password, 'password'),
        email: exports.parseString(object.email, 'email'),
        channelName: exports.parseString(object.channelName, 'channel name'),
    };
};
exports.toNewGame = (object, user) => {
    return {
        type: parseGameType(object.type),
        startTime: parseDate(object.startTime),
        players: parsePlayers(object.players),
        status: parseStatus(object.status),
        host: {
            id: user.id,
            displayName: user.username,
            privateData: {
                socketId: null,
                twilioToken: null,
            },
        },
        rounds: parseRounds(object.rounds),
        price: parseNumber(object.price),
    };
};
exports.toPositiveInteger = (object) => {
    const number = parseNumber(object);
    if (!Number.isInteger(number))
        throw new mongoose_1.Error('Invalid number');
    if (number < 1)
        throw new mongoose_1.Error('Invalid number');
    return number;
};
exports.toAuthenticatedUser = (request) => {
    if (!request ||
        !request.user ||
        !request.user.username ||
        !request.user.id ||
        !isString(request.user.username) ||
        !isString(request.user.id))
        throw new mongoose_1.Error('Invalid or missing user');
    return request.user;
};
exports.toCredentials = (object) => {
    return {
        username: exports.parseString(object.username, 'username'),
        password: exports.parseString(object.password, 'password'),
    };
};
/**
 * Checks if the game's host field matches given id. Throws error if not.
 * @param game - game returned from mongodb
 * @param hostId - id to match against game's host
 *
 * @returns validated game
 */
exports.validateGameHost = (game, hostId) => {
    if (!game)
        throw new mongoose_1.Error('Missing game');
    if (!game.host || !game.host.id.toString) {
        throw new mongoose_1.Error('Missing or invalid game host');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (game.host.id.toString() !== hostId) {
        throw new mongoose_1.Error('Invalid request, cannot remove games added by others');
    }
    return game;
};
/**
 * Checks if a player matching given id is found from the given game. If not, throws error.
 * @param game - game returned from mongodb
 * @param inviteCode - code to check for in game players
 *
 * @returns player matching code
 */
exports.validateGamePlayer = (game, inviteCode) => {
    if (!game)
        throw new mongoose_1.Error('Missing game');
    const matchingPlayer = game.players.find((player) => player.privateData.inviteCode === inviteCode);
    if (!matchingPlayer)
        throw new mongoose_1.Error(`Invalid request, no player found with invite code ${inviteCode}`);
    return matchingPlayer;
};
exports.toID = (object) => {
    return exports.parseString(object, 'game/reservation id');
};
exports.toError = (error) => {
    if (!error)
        throw new mongoose_1.Error('Error missing');
    if (!error.message)
        throw new mongoose_1.Error('Error message missing');
    if (!error.name)
        throw new mongoose_1.Error('Error name missing');
    if (!isError(error))
        throw new mongoose_1.Error('Error name or message invalid');
    return error;
};
exports.capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
