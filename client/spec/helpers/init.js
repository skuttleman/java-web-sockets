const Reporter = require('jasmine-spec-reporter');
const jasmineEnv = jasmine.getEnv();
global.WebSocket = function() {};

jasmineEnv.clearReporters();

jasmineEnv.addReporter(new Reporter({
    displayStacktrace: 'summary'
}));
