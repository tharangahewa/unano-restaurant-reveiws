const { series, src, dest } = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass');


function cssClean() {
    return src('css/**/*.css', {read: false})
    .pipe(clean());
}

function cssTranspile(cb) {
    return src("sass/**/*.scss")
    .pipe(sass()).on("error", sass.logError)
    .pipe(dest("css"));
}

exports.cssTranspile = cssTranspile;
exports.default = series(cssClean, cssTranspile);