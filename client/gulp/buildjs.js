var babelify = require('babelify');
var browserify = require('browserify');
var gulp = require('gulp');
var del = require('del');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var errorReporter = require('./utils').errorReporter;

var babelifyConfig = {
    presets: ['es2015', 'react', 'stage-1'],
    ignore: 'node_modules'
};

function browserifyConfig(entry) {
    return {
        extensions: ['.js', '.jsx'],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true,
        entries: entry
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
    return del('../src/main/resources/static/client.js', { force: true });
});

gulp.task('clean:js:manager', function() {
    return del('../src/main/resources/static/manager.js', { force: true });
});

gulp.task('build:js:client', ['clean:js:client'], jsBuild(true, 'client.js'));

gulp.task('build:js:manager', ['clean:js:manager'], jsBuild(true, 'manager.js'));

gulp.task('build:js:keepAlive:client', ['clean:js:client'], jsBuild(false, 'client.js'));

gulp.task('build:js:keepAlive:manager', ['clean:js:manager'], jsBuild(false, 'manager.js'));

gulp.task('build:js', ['build:js:client', 'build:js:manager']);

gulp.task('build:js:keepAlive', ['build:js:keepAlive:client', 'build:js:keepAlive:manager']);

gulp.task('build:watch:js', ['build:js:keepAlive'], function() {
    return gulp.watch('js/**/*.js*', ['build:js:keepAlive']);
});
