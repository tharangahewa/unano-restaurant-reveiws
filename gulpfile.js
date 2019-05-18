const { series, src, dest, watch } = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();


function cssClean() {
    return src('css/**/*.css', { read: false })
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

exports.cssTranspile = cssTranspile;

exports.default = function () {

    watch(['js/**', 'sass/**', 'img/**', 'data/**', '*.html'],
        series(cssClean, cssTranspile)
    );

    browserSync.init({
        server: "./",
        port: 8000
    });
};