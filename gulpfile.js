var gulp = require('gulp'),
	notify = require('gulp-notify'),
	minifyCSS = require('gulp-minify-css'),
	changed = require('gulp-changed'),
	rename = require("gulp-rename"),
	sourcemaps   = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	bourbon = require('node-bourbon'),
	neat = require('node-neat');

var paths = {
	scripts: './assets/js/**/*.js',
	styles: './assets/sass/**/*.scss',
	output: {
		styles: './assets/css'
	}
}

gulp.task('styles.prod', function(){

	gulp.src(paths.styles)
    	.pipe(changed(paths.output.styles, { extension: '.css' }))
    	.pipe(sass({
    		includePaths: neat.includePaths
        }))
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(minifyCSS({
        	keepSpecialComments: 0
        }))
        .pipe(rename({
        	extname: '.min.css'
        }))
        .pipe(notify("production sass compiled"))
        .pipe(gulp.dest(paths.output.styles));

});

gulp.task('styles', function()
{
    gulp.src(paths.styles)
    	.pipe(changed(paths.output.styles, { extension: '.css' }))
    	.pipe(sourcemaps.init())
    	.pipe(sass({
    		includePaths: neat.includePaths,
    		sourceMap: true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(notify("sass compiled"))
        .pipe(gulp.dest(paths.output.styles));
});

gulp.task('watch', function()
{
	gulp.watch(paths.styles, ['styles']);
});

gulp.task('default', ['styles', 'watch']);
gulp.task('prod', ['styles.prod']);