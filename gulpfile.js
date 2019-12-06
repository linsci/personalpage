const gulp = require('gulp')
const minifycss = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const htmlmin = require('gulp-htmlmin')
const cssnano = require('gulp-cssnano')
const htmlclean = require('gulp-htmlclean')
const del = require('del')
const babel = require('gulp-babel')
const autoprefixer = require('gulp-autoprefixer')
const connect = require('gulp-connect')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')

const config = require('./config.json')
const site = './_site'

gulp.task('clean', function() {
	return del(site)
})

gulp.task('assets', function() {
	return gulp
		.src('./assets/*')
		.pipe(gulp.dest(site+'/assets'))
})

gulp.task('fonts', function() {
	return gulp
		.src('./fonts/*')
		.pipe(gulp.dest(site+'/fonts'))
})

gulp.task('scss', function() {
	return gulp
		.src('./src/css/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(minifycss({ compatibility: 'ie8' }))
		.pipe(autoprefixer({ overrideBrowserslist: ['last 2 version'] }))
		.pipe(cssnano({ reduceIdents: false }))
		.pipe(gulp.dest(site+'/css'))
})

gulp.task('css', function() {
	return gulp
		.src('./src/css/*.css')
		.pipe(minifycss({ compatibility: 'ie8' }))
		.pipe(autoprefixer({ overrideBrowserslist: ['last 2 version'] }))
		.pipe(cssnano({ reduceIdents: false }))
		.pipe(gulp.dest(site+'/css'))
})

gulp.task('html', function() {
	return gulp
		.src(site+'/index.html')
		.pipe(htmlclean())
		.pipe(htmlmin())
		.pipe(gulp.dest(site))
})

gulp.task('js', function() {
	return gulp
		.src('./src/js/*.js')
		.pipe(babel({ presets: ['@babel/preset-env'] }))
		.pipe(uglify())
		.pipe(gulp.dest(site+'/js'))
})

gulp.task('pug', function() {
	return gulp
		.src('./src/index.pug')
		.pipe(pug({ data: config }))
		.pipe(gulp.dest(site))
})

gulp.task('build', gulp.series('clean', 'pug', 'css', 'scss', 'js', 'assets', 'fonts', 'html'))
gulp.task('default', gulp.series('build'))

gulp.task('watch', function() {
	gulp.watch('./src/components/*.pug', gulp.parallel('pug'))
	gulp.watch('./src/index.pug', gulp.parallel('pug'))
	gulp.watch('./src/css/**/*.scss', gulp.parallel(['scss']))
	gulp.watch('./src/css/**/*.css', gulp.parallel(['css']))
	gulp.watch('./src/js/*.js', gulp.parallel(['js']))
	gulp.watch('./assets/*', gulp.parallel(['assets']))
	gulp.watch('./fonts/*', gulp.parallel(['fonts']))
	connect.server({
		root: site,
		livereload: true,
		port: 8080
	})
})
