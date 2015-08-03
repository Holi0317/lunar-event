(function () {
  'use strict';
  var gulp = require('gulp');
  var $ = require('gulp-load-plugins')();
  var del = require('del');
  var runSequence = require('run-sequence');
  var browserSync = require('browser-sync').create();
  var reload = browserSync.reload;

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

    gulp.task('serve', function() {
      browserSync.init({
        server: {
          baseDir: "./app"
        },
      });

      gulp.watch('app/index.html', reload);
      gulp.watch('app/elements/**/*', reload);
      gulp.watch('app/bower_components/**/*', reload);
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
