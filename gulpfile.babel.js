import gulp from 'gulp';
import babel from 'gulp-babel';

gulp.task('es6', () => {
  gulp.src('./src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./lib'));
});
