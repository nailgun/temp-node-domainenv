var domainenv = require('./domainenv'),
    log = require('./domainenv-log'),
    puncher = require('./domainenv-puncher'),
    profile = require('./domainenv-profile'),
    ArrayTransport = require('./winston-array');

var env = domainenv.create();

process.nextTick(function () {
    log.info('Hello from bare JS');
});

env.use(log.plugin({
    transports: [new log.transports.Console({
        level: 'debug',
        colorize: true
    })]
}));

env.use(puncher.plugin());
env.use(profile.plugin('Total'));

var journal = [];

puncher.start('Total');

env.domain.run(function () {
    puncher.start('nextTick');
    var profileNextTick = profile.start('nextTick');

    log.profile('Profile 2');
    process.nextTick(function () {
        puncher.stop('nextTick');
        profileNextTick.stop();

        log.debug('Hello from domain env');
        log.profile('Profile 2');
    });

    log.profile('Profile 1');

    puncher.start('Timer');
    var profileTimer = profile.start('Timer');

    setTimeout(function () {
        puncher.stop('Timer');
        profileTimer.stop();

        log.profile('Profile 1');
    }, 100);

    var env = domainenv.create();
    env.use(log.plugin()); // just to be sure that log exists (MIDDLEWARE)
    env.log.add(ArrayTransport, {
        journal: journal
    });

    env.domain.run(function () {
        puncher.start('Nested domain');
        var profileDomain = profile.start('Nested domain');

        process.nextTick(function () {
            puncher.stop('Nested domain');
            profileDomain.stop();

            log.info('Hello from second env');
        });
    });
});

setTimeout(function () {
    puncher.stop('Total');
    env.profile.stop();

    console.log('JOURNAL:', journal);
    console.log(require('util').inspect(env.puncher.result, false, 10, true));
    console.log(require('util').inspect(env.profile.result, false, 10, true));
}, 150);
