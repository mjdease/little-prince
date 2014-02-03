var gulp = require("gulp");
var gutil = require("gulp-util");
var clean = require('gulp-clean');
var browserify = require("gulp-browserify");

var paths = {
    scripts : ["./js/app.js"],
    styles : ["./css/**/*.css"],
    images : ["./img/**/*"]
};

gulp.task("default", ["scripts", "styles", "images", "watch"], function(){
    gulp.src("./index.html")
        .pipe(gulp.dest("./build"));
});

gulp.task("scripts", function(){
    gulp.src(paths.scripts)
        .pipe(browserify())
        .pipe(gulp.dest("./build/js"));
});

gulp.task("styles", function(){
    gulp.src(paths.styles)
        .pipe(gulp.dest("./build/css"));
});

gulp.task("images", function(){
    gulp.src(paths.images)
        .pipe(gulp.dest("./build/img"));
});

gulp.task("watch", function () {
    gulp.watch(paths.scripts, ["scripts"]);
    gulp.watch(paths.styles, ["styles"]);
    gulp.watch(paths.images, ["images"]);
});
