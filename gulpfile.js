var gulp = require('gulp'),
    pug = require('gulp-pug'),
    autoprefixer = require('autoprefixer'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    plumber = require('gulp-plumber'),
    gcmq = require('gulp-group-css-media-queries'),
    rename = require('gulp-rename'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    del = require('del'),
    sass = require('gulp-sass'),
    scss = require('gulp-scss'),
    browserSync = require('browser-sync'),
    server = browserSync.create();

function reload(done) {
    server.reload();
    done();
}

function serve(done) {
    server.init({
        server: {
            baseDir: './dist'
        }
    });
    done();
}

gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
});

var scssFiles = [
    'src/assets/**/*.scss',
    'src/assets/*.scss',
];

var jsFiles = [
    'src/assets/**/*.js'
];

var imgFiles = [
    'src/assets/**/*.{jpg,png,jpeg,svg,gif,ico}',
];

gulp.task('scss', function() {
    var postCSSplugins = [
        autoprefixer({ browsers: ['last 2 version'] }),
    ];

    return gulp.src(scssFiles)
        .pipe(sass())
        // .pipe(concat('app.css'))
        // .pipe(plumber())
        // .pipe(gcmq())
        // .pipe(cssnano())
        .pipe(gulp.dest('dist/css/'))
        // .pipe(server.stream())
});


gulp.task('js', function () {
    return gulp.src(jsFiles)
        .pipe(gulp.dest('dist/'))
});


// gulp.task('js', function () {
//     if (production){
//         return gulp.src(jsFiles)
//             .pipe(concat('assets/app.js'))
//             .pipe(plumber())
//             .pipe(uglify())
//             .pipe(rename({suffix: '.min'}))
//             .pipe(gulp.dest('build'))
//     }
//     return gulp.src(jsFiles)
//         .pipe(concat('assets/app.js'))
//         .pipe(plumber())
//         .pipe(gulp.dest('dist'))
// });

gulp.task('img', function() {
    return gulp.src(imgFiles)
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/'))
});

gulp.task('font', function() {
    return gulp.src('src/assets/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.scss', gulp.series('scss'));
    gulp.watch('src/*.html', gulp.series('html', reload));
    gulp.watch('src/**/**/*.js', gulp.series('js', reload));
    gulp.watch(imgFiles, gulp.series('img', reload));
});

gulp.task('clean', function() {
    return del('./dist');
});

gulp.task('build', gulp.parallel('scss', 'html', 'js', 'img', 'font'));

gulp.task('serve', gulp.parallel('watch', serve));

gulp.task('default', gulp.series('clean', 'build', 'serve'));