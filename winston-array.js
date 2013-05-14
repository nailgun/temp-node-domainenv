var winston = require('winston'),
    util = require('util');

var ArrayTransport = module.exports = function (options) {
    options = options || {};

    this.name = options.name || 'ArrayTransport';
    this.level = options.level || 'debug';
    this.journal = options.journal || [];
};

util.inherits(ArrayTransport, winston.Transport);

ArrayTransport.prototype.log = function (level, msg, meta, callback) {
    this.journal.push({
        level: level,
        msg: msg,
        meta: meta
    });

    callback(null, true);
};

ArrayTransport.prototype.clear = function () {
    this.journal.length = 0;
};
