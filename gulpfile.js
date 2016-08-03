var gulp = require('gulp'),
    babel = require('gulp-babel'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    exec = require('child_process').exec;

function testFn(callback) {
  exec('npm test', function (err) {
    if (err) return callback(err);
    return callback();
  });
}

gulp.task('constants', function () {
  return gulp.src('src/**/*.json')
    .pipe(gulp.dest('lib'));
})

gulp.task('build', [ 'constants' ], function () {
  return gulp.src('src/**/*.js?(x)')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});
 
gulp.task('test', testFn);
gulp.task('build-test', [ 'build' ], testFn);

gulp.task('example', [ 'build-test' ], function () {
  return browserify('example/src/app.jsx', {
    extensions: [ '.jsx', '.js' ],
    debug: true
  })
    .transform(babelify)
    .bundle()
    .pipe(source('example.js'))
    .pipe(gulp.dest('example/lib'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.+(js|jsx|json)', function () {
    gulp.run('build-test');
  });

  gulp.watch('__tests__/**/*.js?(x)', function () {
    gulp.run('test');
  });
});

gulp.task('default', [ 'build-test' ]);
