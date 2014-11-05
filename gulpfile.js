var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});

var jsFilter = plugins.filter('**/*.js');
var lessFilter = plugins.filter('**/*.less');
var pathsSrc = {
    index: 'src/index.html',
    less: ['src/less/*.less','!src/less/_global.less','!src/less/_mixins.less','!src/less/components/**/*.less','!src/less/modules/*.less','!src/less/utilities/*.less'],
    lessWatch:['src/less/**/*.less'],
    scripts: ['src/js/*.js'],
    images: 'src/assets/img/**/*',
    fonts:'src/assets/fonts/**/*',
    fontAwesome:'libraries/font-awesome-4.2.0/fonts/*'
};
var pathsBuild = {
    index: 'build/index.html',
    css: ['build/css/*.css'],
    scripts: ['build/js/*.js'],
    images: 'build/assets/img/**/*'
};
// gulp.task('clean', function() {
//     return gulp.src('', {
//         read: false
//     }).pipe(clean());
// });
gulp.task('font-awesome', function() {
    return gulp.src(pathsSrc.fontAwesome)
    .pipe(gulp.dest('build/assets/fonts/font-awesome'));
});
gulp.task('fonts', function() {
    return gulp.src(pathsSrc.fonts)
    .pipe(gulp.dest('build/assets/fonts'));
});


gulp.task('index', function() {
    var assets = plugins.useref.assets();
    return gulp.src(pathsSrc.index)
    .pipe(plugins.plumber())
    .pipe(assets)
    .pipe(plugins.sourcemaps.init())
    /*.pipe(jsFilter)
    .pipe(plugins.uglify())
    .pipe(plugins.jsmin())
    .pipe(plugins.sourcemaps.write('build/js'))
    .pipe(jsFilter.restore())*/
    .pipe(plugins.sourcemaps.write('/'))
    .pipe(assets.restore())
    .pipe(plugins.useref())
    .pipe(gulp.dest('build'));
});
gulp.task('less', function() {
    return gulp.src(pathsSrc.less)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.plumber())
    .pipe(plugins.less())
    .pipe(plugins.autoprefixer("last 8 version", "> 1%", "ie 8", "ie 7"), {cascade:true})
    .pipe(plugins.sourcemaps.write('/'))
    .pipe(gulp.dest('build/css'));
});
gulp.task('scripts', function() {
    return gulp.src(pathsSrc.scripts)
    .pipe(plugins.plumber())
    .pipe(plugins.uglify({
        mangle:false
    }))
    // .pipe(plugins.sourcemaps.write())
    // .pipe(jsmin())
    .pipe(gulp.dest('build/js'));
});
gulp.task('images', function() {
    return gulp.src(pathsSrc.images)
    .pipe(plugins.imagemin({
        optimizationLevel: 5
    }))
    .pipe(gulp.dest('build/assets/img'));
});

gulp.task('watch',function() {
    gulp.watch(pathsSrc.index, ['index']);
    gulp.watch(pathsSrc.fontAwesome, ['font-awesome']);
    gulp.watch(pathsSrc.fonts, ['fonts']);
    gulp.watch(pathsSrc.lessWatch, ['less']);
    gulp.watch(pathsSrc.scripts, ['scripts']);
    gulp.watch(pathsSrc.images, ['images']);

});
gulp.task('default', ['watch','index','images','font-awesome','fonts','less']);