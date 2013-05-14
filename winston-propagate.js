var winston = require('winston'),
    util = require('util');

var Propagate = module.exports = function (parentLogger, options) {
    options = options || {};

    this.parentLogger = parentLogger;
    this.name = options.name || 'PropagateTransport';
    this.level = options.level || 'debug';
};

util.inherits(Propagate, winston.Transport);

Propagate.prototype.log = function () {
    this.parentLogger.log.apply(this.parentLogger, arguments);
};
