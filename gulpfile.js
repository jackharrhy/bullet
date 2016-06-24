var gulp = require('gulp');
var watch = require('gulp-watch');

var rename = require('gulp-rename');

gulp.task('default', [
	'pug',
	'less',
	'browserify'
]);

var pug = require('gulp-pug');
gulp.task('pug', function () {
	return gulp.src('./src/**/*.pug')
		.pipe(watch('./src/**/*.pug'))
		.pipe(pug({}))
		.pipe(gulp.dest('./dist'));
});

var cssmin = require('gulp-cssmin');
var less = require('gulp-less');
gulp.task('less', function () {
	return gulp.src('./src/**/*.less')
		.pipe(watch('./src/**/*.less'))
		.pipe(less({}))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist'));
});

var watchify = require('gulp-watchify');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

var bundlePaths = {
	src: [
		'src/**/*.js'
	],
	dest:'dist/js/'
}

gulp.task('browserify', watchify(function(watchify) {
	return gulp.src(bundlePaths.src)
		.pipe(watchify({
			watch: true
		}))
		.pipe(streamify(uglify()))
		.pipe(gulp.dest(bundlePaths.dest));
}));

gulp.task('watchify', ['enable-watch-mode', 'browserify']);

gulp.task('watch', ['watchify'], function () {
	// other watch code
});

