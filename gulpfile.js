
// Підключення плагінів

const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const spritesmith = require('gulp.spritesmith');
const svgstore = require('gulp-svgstore');




// Переміщення шрифтів 

function fonts() {
	return gulp.src('src/fonts/*/*.*')
			.pipe(gulp.dest('build/fonts/'));
}

// Переміщення html

function html() {
	return gulp.src('*.html')
			.pipe(gulp.dest('build/'));
}

// Компіляція css

function styles() {
	return gulp.src(['./src/css/**/*.css','./src/css/**/*.scss'])
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sass({includePaths: ['node_modules/normalize-path/']}))
		.pipe(concat('all.css'))
		.pipe(autoprefixer({
			// browsers: ['>0.1%'],
			// 	cascade: false
			}))
		.pipe(sourcemaps.write())

		// .pipe(cleanCSS(
		// 		level: 2
		// 	))
		.pipe(gulp.dest('./build/css'))
		.pipe(browserSync.stream());
}


// Компіляція js

function scripts() {
	return gulp.src([
		'./src/js/jquery/*.js',
		'./src/js/**/*.js',
		'./src/js/main.js'
])
	// .pipe(concat('all.js'))
	// .pipe(uglify({
	// 	toplevel: true
	// }))
	.pipe(gulp.dest('./build/js'))
	.pipe(browserSync.stream());
}

// Функція мініфікації зображень

function imgs() {
	return gulp.src(['src/img/**/*.*'])
		.pipe(imagemin())
        .pipe(gulp.dest('build/img'));
}


// Функція моніторингу змін

function watch() {
	browserSync.init({
        server: {
            baseDir: "./"
        },
        tunnel: true
    });

	gulp.watch(['./src/css/**/*.scss', './src/css/**/*.css'], styles);
	gulp.watch('./src/js/**/*.js', scripts);
	gulp.watch('./src/img/**/*.*', imgs);
	gulp.watch('*.html', html);
	gulp.watch("*.html").on("change", browserSync.reload);
};


// Функція очистки лишнього 

function clean() {
	return del(['build/*'])
};

// Функція створення спрайту

function sprite(cb) {
	var spriteData = gulp.src('./src/img/links/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../img/links/sprite.png',
    cssName: '_sprite.scss'
  }));
    spriteData.img.pipe(gulp.dest('./build/img/links/'));
    spriteData.css.pipe(gulp.dest('./src/css/'));
    cb();
}

// Функція створення svg-спрайту

function svgsprite() {
	return gulp.src('src/img/svg/*.svg')
			.pipe(svgstore())
			.pipe(gulp.dest('build/img/svg/'));
}

// Список тасків 

gulp.task('imgs', imgs);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('clean', clean); 
gulp.task('sprite', sprite);
gulp.task('svgsprite', svgsprite);
gulp.task('fonts', fonts);
gulp.task('html', html);

gulp.task('moving', gulp.parallel(fonts, html));

gulp.task('build', gulp.series('clean', gulp.parallel(sprite, svgsprite, styles, scripts, imgs, fonts, html)));

gulp.task('dev', gulp.series('build', 'watch'));
