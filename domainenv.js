var domain = require('domain'),
    _ = require('underscore');

exports.active = function () {
    return domain.active && domain.active.env;
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
