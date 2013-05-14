var winston = require('winston'),
    WinstonPropagate = require('./winston-propagate'),
    domainenv = require('./domainenv');

exports.plugin = function (config) {
    return function (env) {
        if (env.log) return;

        if (env.parent && env.parent.log) {
            env.log = new winston.Logger({
                transports: [
                    new WinstonPropagate(env.parent.log)
                ]
            });
        }
        else {
            env.log = new winston.Logger(config);
        }
    };
};

exports.transports = winston.transports;

var METHODS = ['log', 'profile', 'debug', 'info', 'warn', 'error'];
METHODS.forEach(function (method) {
    exports[method] = function () {
        var env = domainenv.active();
        if (env && env.log) {
            return env.log[method].apply(env.log, arguments);
        }

        if (env) {
            winston.warn('NEXT MESSAGE FROM CONTEXT WITHOUT LOG');
        }
        else {
            winston.warn('NEXT MESSAGE WITHOUT CONTEXT');
        }
        return winston[method].apply(winston, arguments);
    };
});
