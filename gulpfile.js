"use strict";

var fs = require("fs");
var path = require("path");
var url = require("url");
var gulp = require('gulp');
var sass = require('gulp-sass');
var mocha = require('gulp-mocha');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var bourbon = require('node-bourbon');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var LOCAL_SERVER_PORT = 4242;
var paths = {};

paths.styles = [
	'./styles.scss'
];

paths.jsFiles = [
	'./src/nevakee-menu/nevakee-menu.js',
	'./src/nevakee-zone-defilement/nevakee-zone-defilement.js',
	'./src/nevakee-photo-model/nevakee-photo-model.js',
	'./src/nevakee-portfolio/nevakee-portfolio.js',
	'./src/nevakee-main-image/nevakee-main-image.js',
	'./src/nevakee-lazy-image/nevakee-lazy-image.js'
	
];



/******************* SASS ******************/
gulp.task('build:sass', function () {
	gulp.src(paths.styles)
	.pipe(sass({
		includePaths: paths.styles
	}))
	.on("error", errorAlert)
	.pipe(cssnano({
		safe: true ,
		autoprefixer: { add: true, remove: true, browsers: ['last 2 versions', 'iOS >= 8']}
	}))
	.on("error", errorAlert)
	.pipe(gulp.dest('./bundles/'));
});

gulp.task('watch:sass', function() {
	gulp.watch(paths.styles, ['build:sass']);
});

/******************* JS ******************/
gulp.task('build:js', function() {
	console.log("build.js");
	return browserify(paths.jsFiles)
	.bundle()
	.on("error", errorAlert)
	.pipe(source('bundle.js'))
	.pipe(gulp.dest('./bundles/'));
});

gulp.task('watch:js', function() {
	gulp.watch(paths.jsFiles, ['build:js']);
});

/************************ Serve ****************/

gulp.task('watch:all', function() {
	livereload.listen({
        start: true,
        reloadPage: 'index.html'
    });
    gulp.watch(paths.jsFiles, ['build:js']);
    gulp.watch(paths.styles, ['build:sass']);
});


gulp.task('serve', function() {
    connect.server({
        port: LOCAL_SERVER_PORT,
        livereload: true
    });
});



gulp.task('build:all', ['build:js', 'build:sass']);


gulp.task('default', ['build:all', 'serve','watch:all']);

function errorAlert (error) {
	console.log(error.message);
}
