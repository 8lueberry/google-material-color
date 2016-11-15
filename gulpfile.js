var _ = require('lodash');
var clean = require('gulp-clean');
var colors = require('./src/colors');
var compass = require('gulp-compass')
var gulp = require('gulp');
var header = require('gulp-header');
var less = require('gulp-less');
var path = require('path');
var packageConfig = require('./package.json');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var stylus = require('gulp-stylus');
var sync = require('gulp-config-sync');
var template = require('gulp-template');
var util = require('util');

var paths = {
  destination: 'dist',
  test: 'test',

  stylus: 'palette.styl',
  sass: 'palette.scss',
  less: 'palette.less',
  css: 'palette.css',
  cssVar: 'palette.var.css',
  js: 'palette.js',
};

var banner = '' +
  '/**\n' +
  ' * <%= name %> v<%= version %>\n' +
  ' * <%= homepage %>\n' +
  ' */\n';

/**
 * Generates all the plugins
 */
gulp.task('default', [/*'sync', */'clean-dist', 'stylus', 'sass', 'less', 'css', 'css-var', 'js']);

/**
 * Generates the test files: compile lib to css
 */
gulp.task('test', ['clean-test', 'test-page', 'test-stylus', 'test-sass', 'test-less', 'css', 'css-var', 'js']);

////////////////////////////////////////////////////////////////////////////////
// CSS
////////////////////////////////////////////////////////////////////////////////

/**
 * Generates the css files
 */
gulp.task('css', ['clean-dist', 'clean-test'], function() {
  return gulp.src('src/templates/css')
    .pipe(template({ colors: colors, }))
    .pipe(rename(paths.css))
    .pipe(header(banner, packageConfig))
    .pipe(gulp.dest(paths.destination));
});

/**
 * Generates the css-var files
 */
gulp.task('css-var', ['clean-dist', 'clean-test'], function() {
  return gulp.src('src/templates/css-var')
    .pipe(template({ colors: colors, }))
    .pipe(rename(paths.cssVar))
    .pipe(header(banner, packageConfig))
    .pipe(gulp.dest(paths.destination));
});

////////////////////////////////////////////////////////////////////////////////
// JSON
////////////////////////////////////////////////////////////////////////////////

/**
 * Generates the js files
 */
gulp.task('js', ['clean-dist', 'clean-test'], function() {
  return gulp.src('src/templates/js')
    .pipe(template({ colors: colors, }))
    .pipe(rename(paths.js))
    .pipe(header(banner, packageConfig))
    .pipe(gulp.dest(paths.destination));
});

////////////////////////////////////////////////////////////////////////////////
// STYLUS
////////////////////////////////////////////////////////////////////////////////

/**
 * Generates the stylus files
 */
gulp.task('stylus', ['clean-dist', 'clean-test'], function() {
  return gulp.src('src/templates/stylus')
    .pipe(template({ colors: colors, }))
    .pipe(rename(paths.stylus))
    .pipe(header(banner, packageConfig))
    .pipe(gulp.dest(paths.destination));
});

/**
 * Stylus css for test
 */
gulp.task('test-stylus', ['stylus'], function() {
  gulp.src('src/templates/test-stylus')
    .pipe(template({
      path: path.join('../../', paths.destination, paths.stylus),
      colors: colors,
    }))
    .pipe(stylus())
    .pipe(rename('stylus.css'))
    .pipe(gulp.dest(paths.test));
});

////////////////////////////////////////////////////////////////////////////////
// SASS
////////////////////////////////////////////////////////////////////////////////

/**
 * Generates the sass files
 */
gulp.task('sass', ['clean-dist', 'clean-test'], function() {
  return gulp.src('src/templates/scss')
    .pipe(template({ colors: colors, }))
    .pipe(rename(paths.sass))
    .pipe(header(banner, packageConfig))
    .pipe(gulp.dest(paths.destination));
});

/**
 * Sass css for test
 */
gulp.task('test-sass', ['sass', 'test-sass-template'], function() {
  gulp.src(path.join(paths.test, '*.scss'))
    .pipe(compass({
      css: paths.test,
      sass: paths.test,
      import_path: paths.destination,
    }))
    .pipe(gulp.dest(paths.test));
})

gulp.task('test-sass-template', function() {
  return gulp.src('src/templates/test-scss')
    .pipe(template({
      path: paths.sass,
      colors: colors,
    }))
    .pipe(rename('sass.scss'))
    .pipe(gulp.dest(paths.test));
});

////////////////////////////////////////////////////////////////////////////////
// LESS
////////////////////////////////////////////////////////////////////////////////

/**
 * Generates the less files
 */
gulp.task('less', ['clean-dist', 'clean-test'], function() {
  return gulp.src('src/templates/less')
    .pipe(template({ colors: colors, }))
    .pipe(rename(paths.less))
    .pipe(header(banner, packageConfig))
    .pipe(gulp.dest(paths.destination));
});

gulp.task('test-less', ['less', 'test-less-template'], function () {
  gulp.src(path.join(paths.test, '*.less'))
    .pipe(less({
      paths: [ path.join(__dirname, paths.destination) ],
    }))
    .pipe(rename('less.css'))
    .pipe(gulp.dest(paths.test));
});

gulp.task('test-less-template', function() {
  return gulp.src('src/templates/test-less')
    .pipe(template({
      path: path.join('../', paths.destination, paths.less),
      colors: colors,
    }))
    .pipe(rename('less.less'))
    .pipe(gulp.dest(paths.test));
});

////////////////////////////////////////////////////////////////////////////////
// TESTS
////////////////////////////////////////////////////////////////////////////////

/**
 * Test page html
 */
gulp.task('test-page', ['clean-dist', 'clean-test'], function() {
  gulp.src('src/templates/test-page')
    .pipe(template({
      path: {
        css: path.join('../', paths.destination, paths.css),
        js: path.join('../', paths.destination, paths.js),
      },
      colors: colors,
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(paths.test));
});

////////////////////////////////////////////////////////////////////////////////
// CLEAN
////////////////////////////////////////////////////////////////////////////////

/**
 * Cleans the distribution folder
 */
gulp.task('clean-dist', function() {
  return gulp.src(paths.destination, {read: false})
    .pipe(clean());
});

/**
 * Cleans the test
 */
gulp.task('clean-test', function() {
  return gulp.src(paths.test, {read: false})
    .pipe(clean());
});

////////////////////////////////////////////////////////////////////////////////
// VERSIONING
////////////////////////////////////////////////////////////////////////////////

gulp.task('sync', function() {
  return gulp.src('bower.json')
    .pipe(sync())
    .pipe(gulp.dest('.'));
});

////////////////////////////////////////////////////////////////////////////////
// CLEAN
////////////////////////////////////////////////////////////////////////////////

/**
 * Watch dev
 */
gulp.task('watch', ['default', 'test'], function () {
  gulp.watch('src/templates/*', ['default', 'test']);
});
