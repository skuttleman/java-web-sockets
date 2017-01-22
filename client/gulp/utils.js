function errorReporter(exit) {
    return function(err) {
        if (err.name && err.message && err.codeFrame) {
            console.error(err.name + ':', err.message);
            console.error(err.codeFrame, '\n');
        } else {
            console.log('An error occurred', err);
        }
        if (exit) process.exit(1);
        this.emit('end');
    };
}

module.exports = {
    errorReporter: errorReporter
};
