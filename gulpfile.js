'use strict';

let gulp = require('gulp');
let $ = require('gulp-load-plugins')();
let del = require('del');
let runSequence = require('run-sequence');
let webpackStream = require('webpack-stream');
let webpack = require('webpack');

let browserSync = require('browser-sync').create();
let reload = browserSync.reload;

function webpackConfig() {
  return {
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel?cacheDirectory',
          exclude: /node_modules/
        },
        { test: /\.css$/, loader: 'style-loader!css-loader' },
        { test: /\.json$/, loader: 'json-loader' }
      ]
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    output: {
      filename: 'bundle.js'
    },
    plugins: []
  }
}

gulp.task('html', () => {
  return gulp.src('app/index.html')
  .pipe($.htmlmin({
    removeComments: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeIgnored: true
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('clean', () => {
  return del(['dist', '.tmp']);
});

gulp.task('bundle', () => {
  return gulp.src('app/index.js')
  .pipe(webpackStream(webpackConfig()))
  .pipe(gulp.dest('.tmp'))
});

gulp.task('bundle:dist', () => {
  let config = webpackConfig();
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
  config.plugins.push(new webpack.EnvironmentPlugin(['NODE_ENV']));

  return gulp.src('app/index.js')
  .pipe(webpackStream(config))
  .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['html', 'bundle'], () => {
  browserSync.init({
    server: {
      baseDir: ['.tmp', 'app']
    },
    port: 3000
  });

  gulp.watch('app/index.html', reload);
  gulp.watch('app/**/*.js', ['bundle', reload]);
  gulp.watch('app/**/*.jsx', ['bundle', reload]);
});

gulp.task('serve:dist', ['default'], () => {
  browserSync.init({
    server: {
      baseDir: ['dist']
    },
    port: 3001
  });
});

gulp.task('default', cb => {
  process.env.NODE_ENV = 'production';
  return runSequence(
    'clean',
    ['bundle:dist', 'html'],
    cb
  );
});

gulp.task('push', () => {
  return gulp.src('./dist/**/*')
  .pipe($.ghPages());
});

gulp.task('deploy', cb => {
  return runSequence(
    'default',
    'push',
    cb
  );

});
