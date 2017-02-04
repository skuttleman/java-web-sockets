require('babel-core/register');

var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var errorReporter = require('./utils').errorReporter;

function test(exit) {
    return function() {
        return gulp.src('client/spec/**/*.js')
            .pipe(jasmine().on('error', errorReporter(exit)));
    };
}

gulp.task('test:keepAlive', test());

gulp.task('test', test(true));

gulp.task('test:watch', ['test:keepAlive'], function() {
    return gulp.watch(['client/spec/**/*.js*', 'client/js/**/*.js*'], test());
});
