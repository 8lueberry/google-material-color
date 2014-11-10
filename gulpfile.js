var _ = require('lodash');
var clean = require('gulp-clean');
var colors = require('./src/colors');
var compass = require('gulp-compass')
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var stylus = require('gulp-stylus');
var template = require('gulp-template');

var paths = {
  destination: 'dist',
  test: 'test/',

  stylus: 'color.styl',
  sass: 'color.scss',
  less: 'color.less',
  css: 'color.css',
  js: 'color.js',
};

/**
 * Generates all the plugins
 */
gulp.task('default', ['clean-dist', 'stylus', 'sass', 'less', 'css', 'js']);

/**
 * Generates the test files: compile lib to css
 */
gulp.task('test', ['clean-test', 'test-page', 'test-stylus', 'test-sass', 'test-less', 'css', 'js']);

////////////////////////////////////////////////////////////////////////////////
// CSS
////////////////////////////////////////////////////////////////////////////////

/**
 * Generates the css files
 */
gulp.task('css', function() {
  return gulp.src('src/templates/css')
    .pipe(template({ colors: colors, }))
    .pipe(rename(paths.css))
    .pipe(gulp.dest(paths.destination));
});

////////////////////////////////////////////////////////////////////////////////
// JSON
////////////////////////////////////////////////////////////////////////////////

/**
 * Generates the json files
 */
gulp.task('js', function() {
  return gulp.src('src/templates/js')
    .pipe(template({ colors: colors, }))
    .pipe(rename(paths.js))
    .pipe(gulp.dest(paths.destination));
});

////////////////////////////////////////////////////////////////////////////////
// STYLUS
////////////////////////////////////////////////////////////////////////////////

/**
 * Generates the stylus files
 */
gulp.task('stylus', function() {
  return gulp.src('src/templates/stylus')
    .pipe(template({ colors: colors, }))
    .pipe(rename(paths.stylus))
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
gulp.task('sass', function() {
  return gulp.src('src/templates/scss')
    .pipe(template({ colors: colors, }))
    .pipe(rename(paths.sass))
    .pipe(gulp.dest(paths.destination));
});

/**
 * Sass css for test
 */
gulp.task('test-sass', ['sass', 'test-sass-template'], function() {
  gulp.src(path.join(paths.test, '*.scss'))
    .pipe(compass({
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
gulp.task('less', function() {
  return gulp.src('src/templates/less')
    .pipe(template({ colors: colors, }))
    .pipe(rename(paths.less))
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
      path: paths.less,
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
gulp.task('test-page', function() {
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
  return gulp.src(path.join(paths.destination, '*'), {read: false})
    .pipe(clean());
});

/**
 * Cleans the test
 */
gulp.task('clean-test', function() {
  return gulp.src(path.join(paths.test, '*'), {read: false})
    .pipe(clean());
});


/**
 * Watch dev
 */
gulp.task('watch', ['default', 'test'], function () {
  gulp.watch('src/templates/*', ['default', 'test']);
});
