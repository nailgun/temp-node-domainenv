var domain = require('domain');

module.exports = function (errHandler) {
    return function (req, res, next) {
        var d = domain.create();
        var handler = errHandler || next;

        d.add(req);
        d.add(res);

        res.on('close', function () {
            d.dispose();
        });

        res.on('finish', function () {
            d.dispose();
        });

        d.on('error', function (err) {
            d.dispose();
            handler(err, req, res, next);
        });

        d.run(next);
    };
};
