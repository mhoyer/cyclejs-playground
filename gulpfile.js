var gulp = require('gulp');  
var sourcemaps = require('gulp-sourcemaps');  
var ts = require('gulp-typescript');  
var jsx = require('gulp-jsx');
var rename = require('gulp-rename');

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('tsc', function() {  
  return gulp.src('src/app.ts*')
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject))
    .pipe(jsx({factory: 'CycleDOM.hJSX' }))
    .pipe(rename({extname: ".js"}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['tsc'], function() {
  gulp.watch(['src/**/*', 'typings/**/*'], ['tsc'])
});

gulp.task('default', ['tsc']);
