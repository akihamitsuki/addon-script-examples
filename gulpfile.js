const projectName = 'script-examples';

const tsSettings = {
  module: 'es2020',
  moduleResolution: 'node',
  lib: ['es2020', 'dom'],
  strict: true,
  target: 'es2020',
  noImplicitAny: true,
  removeComments: true,
};

const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');
const os = require('os');

const mcdir =
  os.homedir() +
  '/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/';

function clean_build(callbackFunction) {
  del(['build/behavior_pack/', 'build/resource_pack/']).then(
    (value) => {
      callbackFunction();
    },

    (reason) => {
      callbackFunction();
    }
  );
}

function copy_behavior_pack() {
  return gulp.src(['behavior_pack/**/*']).pipe(gulp.dest('build/behavior_pack'));
}
function copy_resource_pack() {
  return gulp.src(['resource_pack/**/*']).pipe(gulp.dest('build/resource_pack'));
}
const copy_content = gulp.parallel(copy_behavior_pack, copy_resource_pack);

function compile_scripts() {
  return gulp

    .src('scripts/**/*.ts')

    .pipe(ts(tsSettings))

    .pipe(gulp.dest('build/behavior_pack/scripts'));
}

const build = gulp.series(clean_build, copy_content, compile_scripts);

function clean_localmc(callbackFunction) {
  if (!projectName || !projectName.length || projectName.length < 2) {
    console.log('No projectName specified.');
    callbackFunction();
    return;
  }

  const delFolders = [
    mcdir + 'development_behavior_packs/' + projectName,
    mcdir + 'development_resource_packs/' + projectName,
  ];

  del(delFolders, {
    force: true,
  }).then(
    (value) => {
      callbackFunction();
    },

    (reason) => {
      callbackFunction();
    }
  );
}

function deploy_localmc_behavior_pack() {
  return gulp
    .src(['build/behavior_pack/**/*'])
    .pipe(gulp.dest(mcdir + 'development_behavior_packs/' + projectName));
}
function deploy_localmc_resource_pack() {
  return gulp
    .src(['build/resource_pack/**/*'])
    .pipe(gulp.dest(mcdir + 'development_resource_packs/' + projectName));
}

const deploy_localmc = gulp.series(
  clean_localmc,

  gulp.parallel(deploy_localmc_behavior_pack, deploy_localmc_resource_pack)
);

function watch() {
  return gulp.watch(
    ['scripts/**/*.ts', 'behavior_pack/**/*', 'resource_pack/**/*'],

    gulp.series(build, deploy_localmc)
  );
}

exports.default = gulp.series(build, deploy_localmc);
exports.build = gulp.series(build);
exports.clean = gulp.series(clean_build, clean_localmc);
exports.watch = gulp.series(build, deploy_localmc, watch);
