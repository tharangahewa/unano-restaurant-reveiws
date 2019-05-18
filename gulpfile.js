const { series, src, dest } = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');


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
        .pipe(dest("css"));
}

exports.cssTranspile = cssTranspile;
exports.default = series(cssClean, cssTranspile);