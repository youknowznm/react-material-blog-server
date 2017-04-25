let gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    cleanCSS = require('gulp-clean-css'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload');

gulp.task('css', function() {
    return sass('static/src/_styles/**/*.scss')
        .pipe(autoprefixer())
        .pipe(plumber())
        .pipe(cleanCSS())
        .pipe(gulp.dest('static/dist/styles/'))
        .pipe(livereload());
});

gulp.task('js', function() {
	return gulp
		.src('static/src/_javascripts/**/*.js')
        .pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['latest']
		}))
        .pipe(uglify())
		.pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest('static/dist/javascripts/'))
});

gulp.task('img', function() {
    return gulp.src('static/src/_images/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('static/dist/images/'));
});

gulp.task('default', ['css', 'js', 'img'], function() {
    livereload.listen();
    gulp
        .watch('static/src/_styles/**/*.*', ['css'])
        .on('change', livereload.changed);
    gulp
        .watch('static/src/_javascripts/**/*.*', ['js'])
        .on('change', livereload.changed);
    gulp
        .watch('static/src/_images/**/*.*', ['img'])
        .on('change', livereload.changed);
})
