require('babel-core/register');
var gulp = require("gulp");
var gutil = require("gulp-util");
var notify = require("gulp-notify");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var mocha = require("gulp-mocha");

const dev = !process.argv.includes('--production')

gulp.task("default", ["watch", "server"]);

gulp.task("watch", ["build", "mocha"], function() {
    gulp.watch(["src/app/**/*", "src/sass/**/*"], ["build"]);
    gulp.watch(["src/app/**/*", "src/app/test/**/*.js"], ["mocha"]);
});

gulp.task("mocha", function(){
    return gulp.src(['src/app/test/**/*.js'], { read: false })
        .pipe(mocha())
        .on('error', gutil.log)
        .on('error', notify.onError("Error: <%= error.message %>"));
})

gulp.task("build", function(callback) {
    webpack(webpackConfig(dev), function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            chunks: false,
            colors: true
        }));
        callback();
    });
});


gulp.task("build-dev", function(callback) {
    var devCompiler = webpack(webpackConfig(true));
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            chunks: false,
            colors: true
        }));
        callback();
    });
});

gulp.task("server", function(callback) {
    // Start a webpack-dev-server
    new WebpackDevServer(webpack(webpackConfig(dev)))
        .listen(8100, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8100/");
    });
});
