let gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    cleanCSS = require('gulp-clean-css'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload')

gulp.task('css', function() {
    return sass('src/_styles/pages/*.scss')
        .pipe(autoprefixer())
        .pipe(plumber())
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/styles/'))
        .pipe(livereload())
})


gulp.task('img', function() {
    return gulp.src('src/_images/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images/'))
})

gulp.task('default', ['css', 'img'], function() {
    livereload.listen()
    gulp
        .watch('src/_styles/**/*.*', ['css'])
        .on('change', livereload.changed)
    gulp
        .watch('src/_images/**/*.*', ['img'])
        .on('change', livereload.changed)
})
