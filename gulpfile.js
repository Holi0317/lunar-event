'use strict';

let gulp = require('gulp');
let $ = require('gulp-load-plugins')();
let del = require('del');
let runSequence = require('run-sequence');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');

let browserSync = require('browser-sync').create();
let reload = browserSync.reload;

let secret = require('./secret');

function replaceSecret(stream) {
  return stream
  .pipe($.replace(/@@clientId/g, secret.clientId))
  .pipe($.replace(/@@clientSecret/g, secret.clientSecret))
  .pipe($.replace(/@@basePath/g, secret.basePath));
}

gulp.task('vulcanize', () => {
  let stream = gulp.src('dist/elements/elements.html')
  .pipe($.vulcanize({
    stripComments: true,
    inlineCss: true,
    inlineScripts: true
  }));

  return replaceSecret(stream)
  .pipe($.crisper())
  .pipe($.size())
  .pipe(gulp.dest('dist/elements'));
});

gulp.task('html', () => {
  return replaceSecret(gulp.src('app/index.html'))
  .pipe($.size())
  .pipe(gulp.dest('.tmp/'));
});

gulp.task('html:dist', ['html'], () => {
  return gulp.src('.tmp/index.html')
  .pipe($.htmlmin({
    removeComments: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeIgnored: true,
    minifyJS: true,
    minifyCSS: true
  }))
  .pipe($.size())
  .pipe(gulp.dest('dist'));
})

gulp.task('clean', () => {
  return del(['dist', '.tmp']);
});

gulp.task('copy:bower', () => {
  return gulp.src([
    'app/bower_components/**/*'
  ])
  .pipe($.size())
  .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('copy:elements', () => {
  return replaceSecret(gulp.src([
    'app/elements/**/*',
    '!app/elements/app.js'
  ]))
  .pipe($.size())
  .pipe(gulp.dest('dist/elements'));
});

gulp.task('copy:tmp', () => {
  return gulp.src(['.tmp/**/*'])
  .pipe($.size())
  .pipe(gulp.dest('dist/'));
});

gulp.task('browserify', () => {
  let b = browserify({
    entries: 'app/elements/app.js'
  });

  let stream = b.bundle()
  .pipe(source('app.js'))
  .pipe(buffer());

  return replaceSecret(stream)
  .pipe($.size())
  .pipe(gulp.dest('.tmp/elements'));
});

gulp.task('serve', ['html', 'browserify'], () => {
  browserSync.init({
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'app/bower_components'
      }
    },
    port: 3000
  });

  gulp.watch('app/index.html', ['html', reload]);
  gulp.watch('app/elements/**/*.js', ['browserify', reload]);
});

gulp.task('serve:dist', ['default'], () => {
  browserSync.init({
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('default', cb => {
  return runSequence(
    'clean',
    ['browserify'],
    ['copy:bower', 'copy:elements', 'copy:tmp', 'html:dist'],
    ['vulcanize'],
    cb
  );
});

gulp.task('push', () => {
  return gulp.src('./dist/**/*')
  .pipe($.ghPages());
});

gulp.task('deploy', cb => {
  secret.basePath = '/lunar-event';
  return runSequence(
    'default',
    'push',
    cb
  );

});
