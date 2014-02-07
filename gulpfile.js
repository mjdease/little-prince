var gulp = require("gulp");
var gutil = require("gulp-util");
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var browserify = require("gulp-browserify");

var paths = {
    appEntry : "./js/app.js",
    scripts : ["./js/**/*.js"],
    styles : ["./css/**/*.css"],
    images : ["./img/**/*"],
    fonts : ["./font/*"],
    sounds : ["./audio/**/*"]
};

gulp.task("default", ["scripts", "styles", "images", "fonts", "sounds", "watch"], function(){
    gulp.src("./index.html")
        .pipe(gulp.dest("./build"));
});

gulp.task("scripts", function(){
    gulp.src(paths.appEntry)
        .pipe(plumber())
        .pipe(browserify({
            debug : true
        }))
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

gulp.task("fonts", function(){
    gulp.src(paths.fonts)
        .pipe(gulp.dest("./build/font"));
});

gulp.task("sounds", function(){
    gulp.src(paths.sounds)
        .pipe(gulp.dest("./build/audio"));
});

gulp.task("watch", function () {
    gulp.watch(paths.scripts, ["scripts"]);
    gulp.watch(paths.styles, ["styles"]);
    gulp.watch(paths.images, ["images"]);
    gulp.watch(paths.fonts, ["fonts"]);
    gulp.watch(paths.sounds, ["sounds"]);
});
