var perfcounter = require('./perfcounter'),
    domainenv = require('./domainenv');

exports.plugin = function (msg, meta) {
    return function (env) {
        if (env.profile) return;

        if (env.parent && env.parent.profile) {
            env.profile = env.parent.profile.start();
        }
        else {
            env.profile = perfcounter.start(msg, meta);
        }
    };
};

var dummy = {
  start: function () {
    return dummy;
  },
  stop: function () {
  }
};

var METHODS = ['start'];
METHODS.forEach(function (method) {
    exports[method] = function () {
        var env = domainenv.active();
        if (!env || !env.profile) return dummy;

        return env.profile[method].apply(env.profile, arguments);
    };
});
