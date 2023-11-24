const imagemin = require("gulp-imagemin");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass")(require("sass"));
const sourcemap = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const csso = require("postcss-csso");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");
const sync = require("browser-sync").create();
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const ftp = require("vinyl-ftp");
const gutil = require("gulp-util");
const del = require("del");

// FTP

const FTP = () => {
  const conn = ftp.create({
    host:     '',
    user:     '',
    password: '',
    parallel: 10,
    reload: true,
    log: gutil.log
  });

  var globs = [
    'build/**'
  ];

  var local = 'portfolio/**';


  return gulp.src( globs, { base: 'build/', buffer: false } )
  .pipe( conn.newer( 'www/andreymescherinov.com/portfolio'))
  .pipe( conn.dest( 'www/andreymescherinov.com/portfolio'));


}

exports.FTP = FTP;

// Styles

const styles = () => {
  return gulp
    .src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

exports.styles = styles;

// HTML

const html = () => {
  return gulp
    .src("src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
};

exports.html = html;

// Scripts

const scripts = () => {
  return gulp
    .src("src/js/main.js")
    .pipe(terser())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
};

exports.scripts = scripts;

// WebP

const createWebp = () => {
  return gulp
    .src("src/img/**/*.{jpg,png}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"));
};

exports.createWebp = createWebp;

// Images

const images = (done) => {
  gulp
    .src("src/img/**/*.{png,jpg,svg}")
    .pipe(imagemin())
    .pipe(gulp.dest("build/img"));
  done()
};

exports.images = images;

// Sprite

const sprite = () => {
  return gulp
    .src("src/img/icon/*.svg")
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};

exports.sprite = sprite;

// Copy

const copy = (done) => {
  gulp
    .src(
      [
        "src/fonts/*.{woff2,woff}",
        "src/*.ico",
        "src/img/**/*.svg",
        "!src/img/icons/*.svg",
        "src/manifest.webmanifest",
      ],
      {
        base: "src",
      }
    )
    .pipe(gulp.dest("build"));
  done();
};

// Watcher

const watcher = () => {
  gulp.watch(["src/sass/**/*.scss"], gulp.series(styles));
  gulp.watch(["src/js/script.js"], gulp.series(scripts));
  gulp.watch(["src/*.html"], html).on("change", sync.reload);
};

exports.watcher = watcher;

// Clean

const clean = () => {
  return del("build");
};

exports.clean = clean;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Build

const build = gulp.series(
  clean,
  copy,
  images,
  gulp.parallel(styles, html, scripts, sprite, createWebp)
);

exports.build = build;

exports.default = gulp.series(
  clean,
  copy,
  images,
  gulp.parallel(styles, html, scripts, sprite, createWebp),
  gulp.series(server, watcher)
);
