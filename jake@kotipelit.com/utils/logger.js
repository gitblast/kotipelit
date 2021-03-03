"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDebug = void 0;
const logger = {
    debug: false,
    log: function (...args) {
        if (this.debug) {
            console.log(new Date().toLocaleString(), ...args);
        }
        else if (process.env.NODE_ENV === 'development') {
            // if not in debug mode, log only if in dev env
            console.log(new Date().toLocaleString(), ...args);
        }
    },
    error: function (...args) {
        if (this.debug) {
            console.error(new Date().toLocaleString(), ...args);
        }
        else if (!(process.env.NODE_ENV === 'test')) {
            // if not in debug mode, show errors unless in test env
            console.error(new Date().toLocaleString(), ...args);
        }
    },
};
exports.setDebug = (value) => {
    logger.debug = value;
};
exports.default = logger;
