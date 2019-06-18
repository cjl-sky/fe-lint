/* eslint-disable no-console */

/**
 * @author chenjialin
 * @description 前端代码规范检测脚本
 */

'use strict';

const gulp = require('gulp');
const path = require('path');
const eslint = require('gulp-eslint');
const sassLint = require('gulp-sass-lint');
const htmlLint = require('gulp-html-lint');

// 运行检测命令时的当前路径
const lintCMDPath = process.env.INIT_CWD;
let lintConfigFilePath = lintCMDPath;
if (process.env.isDiffLint) {
  // 如果是增量检测，lint 临时配置文件存于 fe-lint 跟路径下，而非使用 fe-lint 的项目目录下
  lintConfigFilePath = __dirname;
}
// 检测配置
const lintConfig = require(path.join(lintConfigFilePath, process.env.lintConfigFile));
// eslint 配置
const eslintConfig = require('./eslint.config');
// sasslint 配置
const sasslintConfig = require('./sasslint.config');

const baseEslintBaseFile = [`${lintCMDPath}/lint-base.js`]; // 仅用于占位，防止没人任何待检测文件时程序报错
const eslintIgnoreFiles = [
  `!${lintCMDPath}/**/dist/**/*.js`,
  `!${lintCMDPath}/**/vendor/**/*.js`,
  `!${lintCMDPath}/**/node_modules/**/*.js`,
  `!${lintCMDPath}/**/node_modules/**/*.vue`,
  `!${lintCMDPath}/**/*.min.js`,
  // 项目配置文件需要忽略检测
  `!${lintCMDPath}/**/build.config.js`,
  `!${lintCMDPath}/**/check.config.js`,
];
const baseSasslintBaseFile = [`${lintCMDPath}/lint-base.scss`]; // 用途同 lint-base.js
const sasslintIgnoreFiles = [
  `!${lintCMDPath}/**/vendor/**/*.scss`,
  `!${lintCMDPath}/**/node_modules/**/*.scss`,
  `!${lintCMDPath}/**/node_modules/**/*.vue`,
  `!${lintCMDPath}/**/iconfont.scss`,
  `!${lintCMDPath}/**/function.scss`,
  `!${lintCMDPath}/**/*.min.scss`,
];

let lintFiles = {
  js: [],
  vue: [],
  scss: [],
  html: [],
};

if (lintConfig.files) {
  lintConfig.files.map(function(v) {
    let fileType = v.substr(v.lastIndexOf('.') + 1);
    let filePath = path.join(lintCMDPath, v);
    if (process.env.isDiffLint) {
      // 如果是增量检测，被检测代码已经配置为绝对路径，无需再拼接 lintCMDPath
      filePath = v;
    }
    if (filePath.indexOf('!') !== -1) {
      filePath = '!' + filePath.replace('!', '');
    }
    lintFiles[fileType] && lintFiles[fileType].push(filePath);
  });
} else {
  throw new Error('lint.config.json 未配置 files');
}

// js 代码规范检测，不想被检测的代码命名为 *.min.js 即可
gulp.task('eslint', function() {
  let files = lintFiles.js
    .concat(lintFiles.vue)
    .concat(baseEslintBaseFile)
    .concat(eslintIgnoreFiles);
  // console.log(`------ eslint files ------\n${files.join('\n')}\n------ eslint files ------`);
  return gulp
    .src(files)
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// sass 代码规范检测，不想被检测的代码命名为 *.min.scss 即可
gulp.task('sasslint', function() {
  let files = lintFiles.scss
    .concat(lintFiles.vue)
    .concat(baseSasslintBaseFile)
    .concat(sasslintIgnoreFiles);
  // console.log(`------ sasslint files ------\n${files.join('\n')}\n------ sasslint files ------`);
  return gulp
    .src(files)
    .pipe(sassLint(sasslintConfig))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

// html 代码规范检测，不想被检测的代码放入忽略目录即可
gulp.task('htmllint', function() {
  return gulp
    .src(lintFiles.html)
    .pipe(htmlLint())
    .on('error', function(err) {
      console.log(err + '');
    })
    .pipe(htmlLint.format())
    .pipe(htmlLint.failOnError());
});

// lint task
gulp.task(
  'lint',
  [
    'eslint',
    'sasslint',
    // 'htmllint', // 暂时不对 html 代码规范做检测
  ],
  function() {
    // 代码规范检测完毕
  }
);
