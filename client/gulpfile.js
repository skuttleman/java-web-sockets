require('babel-core/register');

var babelify = require('babelify');
var browserify = require('browserify');
var gulp = require('gulp');
var del = require('del');
var jasmine = require('gulp-jasmine');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');

var babelifyConfig = {
  presets: ['es2015', 'react', 'stage-1'],
  ignore: 'node_modules'
};

function browserifyConfig(entry) {
    return {
        extensions: ['.js'],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true,
        entries: entry
    };
}

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

function test(exit) {
    return function() {
        return gulp.src('spec/**/*.js')
            .pipe(jasmine().on('error', errorReporter(exit)));
    };
}

function jsBuild(exit, fileName) {
    return function() {
      return browserify(browserifyConfig('./js/' + fileName))
        .transform(babelify.configure(babelifyConfig))
        .bundle()
        .on('error', errorReporter(exit))
        .pipe(source(fileName))
        .pipe(gulp.dest('../src/main/resources/static'));
    };
}

gulp.task('clean:js:client', function() {
    return del('../src/main/resources/static/client.js', {force: true});
});

gulp.task('clean:js:manager', function() {
    return del('../src/main/resources/static/manager.js', {force: true});
});

gulp.task('test:continue', test());

gulp.task('test', test(true));

gulp.task('test:watch', ['test:continue'], function() {
    return gulp.watch(['spec/**/*.js', 'js/**/*.js'], test());
});

gulp.task('build:js:client', ['clean:js:client'], jsBuild(true, 'client.js'));

gulp.task('build:js:manager', ['clean:js:manager'], jsBuild(true, 'manager.js'));

gulp.task('build:js:client:silent', ['clean:js:client'], jsBuild(false, 'client.js'));

gulp.task('build:js:manager:silent', ['clean:js:manager'], jsBuild(false, 'manager.js'));

gulp.task('build:js', ['build:js:client', 'build:js:manager']);

gulp.task('build:js:silent', ['build:js:client:silent', 'build:js:manager:silent']);

gulp.task('build:watch:js', ['build:js:silent'], function() {
    return gulp.watch('js/**/*.js', ['build:js:silent']);
});

gulp.task('build:watch', ['build:watch:js', 'test:watch']);

gulp.task('clean', ['clean:js']);

gulp.task('build', ['build:js'])

gulp.task('default', ['test']);
