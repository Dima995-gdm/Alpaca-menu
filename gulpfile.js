const { src, dest, parallel, watch } = require("gulp");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const fileInclude = require("gulp-file-include");

// paths
const srcFolder = "./src";
const buildFolder = "./app";
const paths = {
    srcHtml: `${srcFolder}/blocks/**/*.html`,
    buildHtmlFolder: `${buildFolder}`,

    srcCss: `${srcFolder}/**/*.css`,
    buildCssFolder: `${buildFolder}/css`,

    srcImgFolder: `${srcFolder}/img/*`,
    buildImgFolder: `${buildFolder}/img`,
};

const htmlInclude = () => {
    return src([`${srcFolder}/*.html`])
        .pipe(
            fileInclude({
                prefix: "@",
                basepath: "@file",
            })
        )
        .pipe(dest(buildFolder))
        .pipe(browserSync.stream());
};

const styles = () => {
    return (
        src(paths.srcCss)
            .pipe(concat("style.min.css"))
            .pipe(
                cleanCSS({
                    level: 2,
                })
            )
            .pipe(dest(paths.buildCssFolder))
            .pipe(browserSync.stream())
    );
};

const imgToApp = () => {
    src(paths.srcImgFolder)
    .pipe(dest(paths.buildImgFolder))
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: `${buildFolder}`,
        },
    });
    watch(`${srcFolder}/*.html`, htmlInclude);
    watch(paths.srcCss, styles);
    watch(paths.srcImgFolder, imgToApp);
};

exports.htmlInclude = htmlInclude;
exports.styles = styles;
exports.imgToApp = imgToApp;
exports.watchFiles = watchFiles;

exports.default = parallel(htmlInclude, styles, imgToApp, watchFiles);
