const { series, src, dest, watch } = require('gulp');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const minifyCSS = require('gulp-clean-css');
const minifyJS = require('gulp-terser');
const minifyHTML = require('gulp-htmlmin');
var minifyJson = require('gulp-jsonminify');

//css
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

//images
const imagemin = require('gulp-imagemin');
const imageResize = require('gulp-image-resize');
const rename = require('gulp-rename');


function cssClean() {
    return src('css/**/*.css', { read: false, allowEmpty: true })
        .pipe(clean());
}

function distClean() {
    return src('dist', { read: false, allowEmpty: true })
        .pipe(clean());
}

function cssTranspile(cb) {
    return src("sass/**/*.scss")
        .pipe(sass()).on("error", sass.logError)
        .pipe(
            autoprefixer({
                browsers: ["last 2 versions"]
            })
        )
        .pipe(dest("css"))
        .pipe(browserSync.stream());
}

function cssMinify() {
    return src("css/**/*.css")
        .pipe(minifyCSS())
        .pipe(dest("dist/css"));
}

function jsMinify() {
    return src("js/**/*.js")
        .pipe(minifyJS())
        .pipe(dest("dist/js"));
}

function swMinify() {
    return src("sw.js")
        .pipe(minifyJS())
        .pipe(dest("dist"));
}

function htmlMinify() {
    return src('./*.html')
        .pipe(minifyHTML({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(dest('./dist'));
}

function jsonMinify() {
    return src(['data/*.json'])
        .pipe(minifyJson())
        .pipe(dest('dist/data'));
}

function imgCopy() {
    return src(['img/*.jpg'])
        .pipe(dest('dist/img'));
}

function imageProcess() {
    const sizes = [
        { width: 320, suffix: '320w' },
        { width: 480, suffix: '480w' },
        { width: 800, suffix: '800w' }
    ];

    let stream;
    sizes.forEach((size) => {
        stream = src('img_ori/**')
            .pipe(imageResize({ width: size.width }))
            .pipe(
                rename((path) => {
                    path.basename += `-${size.suffix}`;
                })
            )
            .pipe(
                imagemin([imagemin.jpegtran({ progressive: true })])
            )
            .pipe(dest('img'));
    });
    return stream;
}

function imageClean() {
    return src('img/**/*.jpg', { read: false })
        .pipe(clean());
}

exports.cssTranspile = cssTranspile;
exports.image = series(imageClean, imageProcess);
exports.dist = series(distClean, cssTranspile, cssMinify, htmlMinify, jsMinify, swMinify, jsonMinify, imgCopy);

exports.default = function () {

    watch(['js/**', 'sass/**', 'img/**', 'data/**', '*.html'],
        series(cssClean, cssTranspile)
    );

    browserSync.init({
        server: "./",
        port: 8000
    });
};