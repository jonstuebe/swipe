var gulp = require('gulp'),
	notify = require('gulp-notify'),
	changed = require('gulp-changed'),
	compass = require('gulp-compass'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	gulpIgnore = require('gulp-ignore');

var paths = {
	scripts: 'assets/js/**/*.js',
	styles: 'assets/sass/**/*.scss'
},
config = {
	compass: {
		css: 'assets/css',
		sass: 'assets/sass',
		image: 'assets/images'
	}
};

gulp.task('scripts', function(){

	gulp.src('assets/js/main.js')
		.pipe(changed('assets/js/*.js'))
		.pipe(uglify({
			outSourceMap: true,

		}))
		.pipe(concat('main.min.js'))
		.pipe(gulp.dest('assets/js/'))
		.pipe( notify({ message: 'js minified' }) );

	gulp.src(['assets/js/vendor/**/*.js','!./assets/js/vendor/modernizr-2.6.2.min.js','!./assets/js/vendor/jquery-1.11.0.min.js'])
		.pipe(changed('assets/js/vendor/**/*.js'))
		.pipe(uglify({
			outSourceMap: true,

		}))
		.pipe(concat('plugins.min.js'))
		.pipe(gulp.dest('assets/js/'))
		.pipe( notify({ message: 'plugins minified' }) );

});

gulp.task('styles', function(){

	gulp.src(paths.styles)
		.pipe(changed(config.compass.css, {extension: '.css'}))
		.pipe(compass(config.compass))
		.pipe(gulp.dest(config.compass.css))
		.pipe( notify({ message: 'sass compiled' }) );

});

gulp.task('watch', function(){

	gulp.watch(paths.styles, ['styles']);
	gulp.watch(paths.scripts, ['scripts']);

});

gulp.task('default', ['styles','watch']);