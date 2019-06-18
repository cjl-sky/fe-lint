/* eslint-disable no-console */

const exec = require('child_process').exec;
const path = require('path');
const argv = require('yargs').argv;

// 接收 fe-lint 命令行参数
process.env.noconsole = argv.noconsole ? 'true' : '';
process.env.nocommonjs = argv.nocommonjs ? 'true' : '';
process.env.noamd = argv.noamd ? 'true' : '';
process.env.ignorenoundef = argv.ignorenoundef ? 'true' : '';

const cmd = 'gulp lint --gulpfile ' + path.join(__dirname, 'lint.js');

module.exports = {
  runLintTasks: function(cb) {
    exec(cmd, function(error, stdout, stderr) {
      console.log(stdout);
      if (error) {
        console.log(stderr);
        process.exit(1);
      } else {
        cb && cb();
      }
    });
  },
};
