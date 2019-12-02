const syntax = 'scss'; // Syntax: sass or scss;

const gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  concat = require('gulp-concat'),
  cleancss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  autoprefixer = require('gulp-autoprefixer'),
  pug = require('gulp-pug'),
  debug = require('gulp-debug'),
  babel = require('gulp-babel'),
  imagemin     = require('gulp-imagemin'),
  imgCompress  = require('imagemin-jpeg-recompress'),
sourcemaps = require('gulp-sourcemaps'),
  notify = require("gulp-notify");

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },
    notify: false,
    // open: false,
    // online: false, // Work Offline Without Internet Connection
    // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
  })
});
gulp.task('pug', () => {
  return gulp.src(['src/pug/index.pug', 'src/pug/article-2.pug', 'src/pug/article-1.pug'])
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream())
});
gulp.task('styles', function () {
  return gulp.src('src/' + syntax + '/**/*.' + syntax + '')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(debug({title: 'sass:'}))
    .pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
    .pipe(rename({suffix: '.min', prefix: ''}))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(cleancss({level: {1: {specialComments: 0}}})) // Opt., comment out when debugging
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream())
});

gulp.task('js', function () {
  return gulp.src([
      'src/libs/jquery/jquery.min.js',
      'src/libs/jquery/jquery.maskedinput.min.js',
      'src/libs/swiper/swiper.min.js',
      'src/libs/resize.js',
      'src/js/index.js', // Always at the end
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(sourcemaps.write('.'))
    .pipe(browserSync.reload({stream: true}))
});
// Optimize images
gulp.task('img', function() {
  return gulp.src('src/img/**/**/*')
    .pipe(imagemin([
      imgCompress({
        loops: 4,
        min: 70,
        max: 80,
        quality: 'high'
      }),
      imagemin.gifsicle(),
      imagemin.optipng(),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['pug', 'styles', 'js', 'img', 'browser-sync'], function () {
  gulp.watch('src/pug/**/*.pug', ['pug']);
  gulp.watch('src/' + syntax + '/**/*.' + syntax + '', ['styles']);
  gulp.watch(['src/libs/**/*.js', 'src/js/index.js'], ['js']);
  gulp.watch('src/img/**/*.*', ['img']);
  gulp.watch('dist/*.html', browserSync.reload)
});

gulp.task('default', ['watch']);
