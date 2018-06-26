'use strict';

module.exports = function (gulp, gutil) {
  const scripts = require('../lib/scripts.js')(gulp, gutil);
  const ComponentDepedencies = require('../lib/component-dependencies');

  gulp.task('scripts', ['scripts-main', 'scripts-tpls', 'scripts-deps', 'scripts-deps-metadata',
    'scripts-activecast', 'scripts-activecast-tracker', 'scripts-deps-react-li']);

  gulp.task('scripts-main', function (cb) {
    if (gutil.env.ng) {
      return scripts.processScripts(scripts.JS_MAIN_PATTERN, scripts.PLUGIN_SCRIPTS_PATH, undefined, false, true);
    } else {
      cb();
    }
  });

  gulp.task('scripts-tpls', function (cb) {
    if (gutil.env.ng) {
      return scripts.processTpls(scripts.TPL_PATTERN, scripts.PLUGIN_SCRIPTS_PATH, undefined, false);
    } else {
      cb();
    }
  });

  gulp.task('scripts-deps', ['scripts-deps-npm'], function (cb) {
    if (gutil.env.ng) {
      return gulp.src(gutil.env.ng.moduleDependencies.concat(['!node_modules/**']), { base: 'bower_components' })
        .pipe(gulp.dest(scripts.SCRIPTS_DEPS_PATH));
    } else {
      cb();
    }
  });

  gulp.task('scripts-deps-npm', function (cb) {
    if (gutil.env.ng) {
      return gulp.src(gutil.env.ng.moduleDependencies.concat(['!bower_components/**']), { base: 'node_modules' })
        .pipe(gulp.dest(scripts.SCRIPTS_DEPS_PATH));
    } else {
      cb();
    }
  });

  gulp.task('scripts-deps-metadata', function (cb) {
    if (gutil.env.ng) {
      return scripts.createDepsMetadata(scripts.PLUGIN_SCRIPTS_PATH, scripts.SCRIPTS_DEPS_METADATA_PATH);
    } else {
      cb();
    }
  });

  gulp.task('scripts-deps-react-li', function (cb) {
    // TODO: refactor "ng" flag name to be more general and include anything done in angular-li project
    if (gutil.env.ng) {
      new ComponentDepedencies(scripts.COMPONENT_DEPS_SRC_PATH, scripts.COMPONENT_DEPS_DEST_PATH,
          scripts.REACT_LI_COMPONENT_PATH).createDepFile().then(cb);
    } else {
      cb();
    }
  });

  gulp.task('scripts-activecast', function (cb) {
    var originalTask = this.seq[this.seq.length - 1];
    var useWatch = originalTask === 'default';
    if (gutil.env.ng) {
      return scripts.processBundle('src/activecast/ActivecastMain.js', 'plugin/web/html/assets/js/activecast', 'widget.js', useWatch, true);
    } else {
      cb();
    }
  });

  gulp.task('scripts-activecast-tracker', function (cb) {
    var originalTask = this.seq[this.seq.length - 1];
    var useWatch = originalTask === 'default';
    if (gutil.env.ng) {
      return scripts.processBundle('src/activecast/TrackerMain.js', 'plugin/web/html/assets/js/activecast', 'tracker.js', useWatch, true);
    } else {
      cb();
    }
  });

  gulp.task('jshint', function (cb) {
    if (gutil.env.ng) {
      return gulp.src(scripts.JS_MAIN_PATTERN).pipe(scripts.jshint(true));
    } else {
      cb();
    }
  });

  gulp.task('jscs', function () {
    gulp.src(scripts.JS_MAIN_PATTERN).pipe(scripts.jscs(true));
  });
};
