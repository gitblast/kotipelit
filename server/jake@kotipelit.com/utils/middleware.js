"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyForRole = void 0;
exports.onlyForRole = (role) => {
    return (req, _res, next) => {
        try {
            const user = req.user;
            if (!user || user.role !== role) {
                throw new Error('Unauthorized: invalid token role');
            }
            next();
        }
        catch (e) {
            next(e);
        }
    };
};
