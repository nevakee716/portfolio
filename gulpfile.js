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

var paths = {};

paths.styles = [
	'./styles.scss'
];

paths.jsFiles = [
	'./src/nevakee-menu/nevakee-menu.js',
	'./src/nevakee-zone-defilement/nevakee-zone-defilement.js',
	'./src/nevakee-photo-model/nevakee-photo-model.js',
	'./src/nevakee-portfolio/nevakee-portfolio.js'
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

/******************* JS ******************/
gulp.task('build:js', function() {
	return browserify(paths.jsFiles)
	.bundle()
	.on("error", errorAlert)
	.pipe(source('bundle.js'))
	.pipe(gulp.dest('./bundles/'));
});

gulp.task('watch:js', function() {
	gulp.watch(paths.jsFiles, ['build:js']);
});

gulp.task('build:all', ['build:js', 'build:sass'])

gulp.task('watch:all',['watch:js', 'watch:sass']);

gulp.task('default', ['build:all', 'watch:all']);

function errorAlert (error) {
	console.log(error.message);
}
