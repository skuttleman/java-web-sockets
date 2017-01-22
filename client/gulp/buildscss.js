var gulp = require('gulp');
var sass = require('gulp-sass');
var errorReporter = require('./utils').errorReporter;

function sassTranspile(config) {
    return function() {
        return gulp.src('scss/main.scss')
            .pipe(sass().on('error', errorReporter(config)))
            .pipe(gulp.dest('../src/main/resources/static'));
    };
}

gulp.task('clean:scss', function() {
    return del('../src/main/resources/static/main.css', { force: true });
});

gulp.task('build:scss', ['clean:scss'], sassTranspile({ build: true }));

gulp.task('build:scss:keepAlive', sassTranspile());

gulp.task('build:watch:scss', ['build:scss:keepAlive'], function() {
    return gulp.watch('scss/**/*.scss', ['build:scss:keepAlive']);
});
