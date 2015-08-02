(function () {
  'use strict';
  var gulp = require('gulp');
  var $ = require('gulp-load-plugins')();
  var del = require('del');
  var runSequence = require('run-sequence');
  var browserSync = require('browser-sync').create();

  gulp.task('vulcanize', function () {
    return gulp.src('app/elements/elements.html')
      .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true}))
      .pipe($.size())
      .pipe(gulp.dest('dist/elements'));
  });

  gulp.task('html', function () {
    return gulp.src('app/index.html')
    .pipe($.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeIgnored: true,
      minifyJS: true,
      minifyCSS: true,
    }))
    .pipe($.size())
    .pipe(gulp.dest('dist/'));
  });

  gulp.task('clean', function (cb) {
    del(['dist'], cb);
  });

  gulp.task('copy:bower', function () {
    return gulp.src([
      'app/bower_components/**/*'
    ])
    .pipe($.size())
    .pipe(gulp.dest('dist/bower_components'));
  });

  gulp.task('copy:elements', function () {
    return gulp.src([
      'app/elements/**/*'
    ])
    .pipe($.size())
    .pipe(gulp.dest('dist/elements'));
  });

  gulp.task('watch:html', ['html'], browserSync.reload);
  gulp.task('watch:elements', ['copy:elements', 'vulcanize'], browserSync.reload);

  gulp.task('serve', ['default'], function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch('app/index.html', ['watch:html']);
    gulp.watch('app/elements/**/*', ['watch:elements']);
});

  gulp.task('default', function (cb) {
    return runSequence(
      'clean',
      ['copy:bower', 'copy:elements'],
      ['vulcanize', 'html'],
      cb
    );
  });
}());
