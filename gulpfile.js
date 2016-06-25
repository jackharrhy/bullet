var gulp = require('gulp');

var htmlmin = require('gulp-htmlmin');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

var browserSync = require('browser-sync').create();
gulp.task('serve', ['pug','less','js'], function() {
	browserSync.init({
		server: './tmp'
	});

	gulp.watch('src/*.pug', ['pug']);
	gulp.watch('src/css/*.less', ['less']);
	gulp.watch('src/js/*.js', ['browserify']);
});

// Pug -> HTML
var pug = require('gulp-pug');
gulp.task('pug', function () {
	return gulp.src('./src/*.pug')
	.pipe(pug({}))
	.pipe(gulp.dest('./tmp/'))
	.pipe(browserSync.stream());
});

// Less -> CSS
var less = require('gulp-less');
gulp.task('less', function () {
	return gulp.src('./src/css/*.less')
	.pipe(less({}))
	.pipe(gulp.dest('./tmp/css/'))
	.pipe(browserSync.stream());
});

// JS -> Bundled JS
gulp.task('browserify', function () {
	var b = browserify({
		entries: './src/js/index.js',
		debug: true
	});

	return b.bundle()
	.pipe(source('bullet.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({ loadMaps: true }))
	.pipe(uglify())
	.on('error', gutil.log)
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./tmp/js'))
	.pipe(browserSync.stream());
});

gulp.task('default', ['serve']);

gulp.task('prod', ['html','css','js']);

// HTML -> Minified HTML
gulp.task('html', function () {
	return gulp.src('./tmp/*.html')
	.pipe(htmlmin({ collapseWhitespace: true }))
	.pipe(gulp.dest('./dist'));
});

// CSS -> Minified CSS
gulp.task('css', function () {
	return gulp.src('./tmp/css/*.css')
	.pipe(cssmin())
	.pipe(gulp.dest('./dist/css'));
});

// JS -> Minified JS
gulp.task('js', function () {
	return gulp.src('./tmp/js/*.js')
	.pipe(uglify())
	.pipe(gulp.dest('./dist/js'));
});