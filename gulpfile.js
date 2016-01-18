var gulp = require('gulp'),
    less = require('gulp-less');

gulp.task('less',function(){
    gulp.src('public/stylesheets/*.less')
        .pipe(less())
        .pipe(gulp.dest('public/stylesheets'))
});

gulp.task('watch',function(){
    gulp.watch('public/stylesheets/*.less',['less']);
});