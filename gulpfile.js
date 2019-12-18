var gulp = require("gulp"),
	sass = require("gulp-ruby-sass"),
	livereload = require("gulp-livereload"),
	prefix = require("gulp-autoprefixer");
	
	function errorLog(error) {
		console.error.bind(error);
		this.emit("end");
	}


gulp.task("styles", function() {
	return sass("scss/**/*.scss", {style: "expanded"/*compressed*/})
	.on("error", errorLog) 
	.pipe(prefix("last 3 versions"))
	.pipe(gulp.dest("css"))
	.pipe(livereload());
});
gulp.task("document", function() {
	gulp.src("*.html")
	.on("error", errorLog)
	.pipe(livereload());
});
gulp.task("js", function() {
	gulp.src("js/*.js")
	.on("error", errorLog)
	.pipe(livereload());
});

//watches js and styles
gulp.task("watch", function() {
	gulp.watch("js/*", ["js"]);
	gulp.watch("scss/**/*.scss", ["styles"]);
	gulp.watch("*.html", ["document"]);
	livereload.listen();
	
});


gulp.task('default', ["styles","document","js", "watch"]);

