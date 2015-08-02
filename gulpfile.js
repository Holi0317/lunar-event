(function () {
  'use strict';
  var gulp = require('gulp');
  var $ = require('gulp-load-plugins')();
  var del = require('del');
  var runSequence = require('run-sequence');

  gulp.task('vulcanize', function () {
    return gulp.src('app/elements/elements.html')
      .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true}))
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
      .pipe(gulp.dest('dist/'));
  });

  gulp.task('clean', function (cb) {
    del(['dist'], cb);
  });

  gulp.task('copy:bower', function () {
    return gulp.src([
      'app/bower_components/**/*'
    ]).pipe(gulp.dest('dist/bower_components'));
  });

  gulp.task('copy:elements', function () {
    return gulp.src([
      'app/elements/**/*'
    ]).pipe(gulp.dest('dist/elements'));
  });

  gulp.task('watch', function () {
    var html = gulp.watch('app/index.html', ['html']);
    var elements = gulp.watch('app/elements/**/*', function () {
      return runSequence('copy:elements', 'vulcanize');
    });

    var log = function (event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    };

    html.on('change', log);
    elements.on('change', log);
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
