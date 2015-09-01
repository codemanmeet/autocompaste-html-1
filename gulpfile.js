var gulp = require('gulp'),
    webServer = require('gulp-webserver');

gulp.task('default', function() {
    gulp
    .src('app')
    .pipe(webServer({
        liveReload: true,
        directoryListing: true,
        open: true
    }));
});
