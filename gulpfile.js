var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    lost = require('lost'),
    sass = require('gulp-sass'),
    haml = require('gulp-haml'),
    browserSync = require('browser-sync').create('ruthie'),
    browserReload = browserSync.reload;

var paths = {
  cssSource: './src/scss/',
  cssDestination: './dist/css/'
};

gulp.task('scss', function(){
  return gulp.src(paths.cssSource + '**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest(paths.cssDestination))
});

gulp.task('post', function(done) {
  return gulp.src(paths.cssDestination + '**/*.css')
  .pipe(sourcemaps.init())
    .pipe(postcss([
      lost(),
      autoprefixer()
    ]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.cssDestination));
});

// gulp.task('styles', function(){
//   runSequence('scss', 'post');
// });

gulp.task('haml', function(){
    return gulp.src([ './**/*.haml', '!./node_modules/**', '!./bower_components/**' ])
        .pipe(haml())
        .pipe(rename(function (path){
          path.basename = 'index';
          path.ext = 'html';
        }))
        .pipe(gulp.dest('./'))
});

// Initialize browser-sync which starts a static server also allows for
// browsers to reload on filesave
gulp.task('browser-sync', function() {
    browserSync.init({
        server: true
    });
});


gulp.task('default', ['scss', 'post', 'haml', 'browser-sync'], function(){
  gulp.start('haml');
  gulp.start('scss');
  gulp.start('post');
  gulp.watch('./**/*.haml', ['haml']);
  gulp.watch(paths.cssSource + '**/*.scss', ['scss']);
  gulp.watch(paths.cssDestination + '**/*.css', ['post']);
  gulp.watch(paths.cssDestination + '**/*.css', browserReload);
  gulp.watch('./**/*.html', browserReload);
});
