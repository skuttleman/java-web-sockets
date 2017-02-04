var gulp = require('gulp');
require('./gulp/buildjs');
require('./gulp/buildscss');
require('./gulp/test');

gulp.task('build:watch', ['build:watch:js', 'build:watch:scss', 'test:watch']);

gulp.task('clean', ['clean:js', 'clean:scss']);

gulp.task('build', ['build:js', 'build:scss']);

gulp.task('default', ['test']);
