var Puncher = require('puncher'),
    domainenv = require('./domainenv');

exports.plugin = function () {
    return function (env) {
        if (env.puncher) return;

        if (env.parent && env.parent.puncher) {
            env.puncher = env.parent.puncher;
        }
        else {
            env.puncher = new Puncher();
        }
    };
};

var METHODS = ['start', 'stop'];
METHODS.forEach(function (method) {
    exports[method] = function () {
        var env = domainenv.active();
        if (!env || !env.puncher) return;

        return env.puncher[method].apply(env.puncher, arguments);
    };
});
