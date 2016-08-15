var gulp = require('gulp'),
    babel = require('gulp-babel'),
    eslint = require('gulp-eslint'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    sequence = require('run-sequence'),
    exec = require('child_process').exec;

gulp.task('constants', function () {
  return gulp.src('src/**/*.json')
    .pipe(gulp.dest('lib'));
});

gulp.task('build', [ 'constants' ], function () {
  return gulp.src('src/**/*.js?(x)')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('lint', function () {
  return gulp.src('src/**/*.js?(x)')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', function (callback) {
  exec('npm test', function (err, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);

    if (err) return callback(err);
    return callback();
  });
});

gulp.task('default', function (callback) {
  sequence('lint', 'build', 'test', callback);
});

gulp.task('example', [ 'default' ], function () {
  return browserify('example/src/app.jsx', {
    extensions: [ '.jsx', '.js' ],
    debug: true
  })
    .transform(babelify)
    .bundle()
    .pipe(source('example.js'))
    .pipe(gulp.dest('example/lib'));
});

gulp.task('watch', [ 'default' ], function() {
  gulp.watch('src/**/*.+(js|jsx|json)', function () {
    gulp.run('default');
  });

  gulp.watch('__tests__/**/*.js?(x)', function () {
    gulp.run('test');
  });
});
