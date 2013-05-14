var domain = require('domain'),
    _ = require('lodash');

exports.active = function () {
    return process.domain && process.domain.env;
};

exports.create = function () {
    var d = domain.create();
    d.env = new DomainContext(d);
    return d.env;
};

function DomainContext (d) {
    this.domain = d;
    this.parent = exports.active();

    if (this.parent) {
        this.plugins = _.clone(this.parent.plugins);
    } else {
        this.plugins = [];
    }

    this.plugins.forEach(function (plugin) {
        plugin(this);
    }.bind(this));
}

DomainContext.prototype.use = function (plugin) {
    this.plugins.push(plugin);
    plugin(this);
};
