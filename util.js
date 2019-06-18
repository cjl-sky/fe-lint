/* eslint-disable no-console */

const shelljs = require('shelljs');
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const argv = require('yargs').argv;
const md5 = require('md5');

const diffIgnoreConfig = require(path.join(process.cwd(), 'lint.config.json'));

let lintLogJSONPath = argv.lintLogJSONPath || process.cwd();
if (!fs.existsSync(lintLogJSONPath)) {
  shelljs.mkdir('-p', lintLogJSONPath);
}
let lintLogJSON = path.join(lintLogJSONPath, 'lint.log.json'); // 优先接收命令行参数

const ignorePattern = diffIgnoreConfig['diff-ignore-reg'] ? new RegExp(diffIgnoreConfig['diff-ignore-reg'], 'i') : null;

module.exports = {
  // 设置源码仓库 url，统一走 ssh 协议拉取 git 仓库，避免无权限问题
  setSourceRepoGitURL: function() {
    let remoteURL = shelljs.exec(`git config --get remote.origin.url`, { silent: true }).stdout.trim();
    // 使 remoteURL 走 ssh 协议
    remoteURL = `git@${remoteURL.split('@')[1]}`;
    if (remoteURL.indexOf(':') === -1) {
      remoteURL = remoteURL.replace('/', ':');
    }
    let setGitURLCode = shelljs.exec(`git remote set-url origin ${remoteURL}`).code;
    if (setGitURLCode === 0) {
      console.log(`源码仓库 Git URL 设置成功`);
    } else {
      throw new Error(`源码仓库 Git URL 设置失败`);
    }
  },
  // 设置本地的变动文件列表
  setGitLocalDiffFileList: function() {
    let adapter = new FileSync(path.join(__dirname, 'lint.local.diff.json'));
    let db = low(adapter);
    let diffFiles = shelljs.exec(`git diff --name-only`, { silent: true }).stdout.trim();
    let untrackedFiles = shelljs.exec(`git ls-files . --exclude-standard --others`, { silent: true }).stdout.trim();
    console.log(`------ diff files ------\n${diffFiles}\n------ diff files ------`);
    console.log(`------ untracked files ------\n${untrackedFiles}\n------ untracked files ------`);
    let fileList = [];
    let lintFiles = diffFiles + '\n' + untrackedFiles;
    lintFiles.split('\n').forEach(function(v) {
      v = path.join(process.cwd(), v);
      if (!v.match(ignorePattern) || !ignorePattern) {
        fileList.push(v);
      }
    });
    db.set('files', fileList).write();
  },
  // 设置两次检测之间的变动文件列表
  setGitCommitDiffFileList: function() {
    let adapter = new FileSync(path.join(__dirname, 'lint.commit.diff.json'));
    let db = low(adapter);
    let lintLogAdapter = new FileSync(lintLogJSON);
    let lintLogDb = low(lintLogAdapter);
    // 必须通过命令行传入 currentBranch 参数，这也避免了本地开发时误调用 npm run ci-test 的问题
    // 因为本地运行 npm run ci-test 时没有 currentBranch 参数传入
    let currentBranch = argv.currentBranch;
    if (!currentBranch) {
      throw new Error(`获取不到当前分支`);
    }
    console.log(`currentBranch = ${currentBranch}`);

    // 指定当前为调试状态时，无需设置源码仓库 git URL，也无需切换分支
    if (!argv.t) {
      this.setSourceRepoGitURL();

      let switchBranchCode = shelljs.exec(
        `git fetch --all --prune && git reset HEAD --hard && git checkout ${currentBranch} && git pull origin ${currentBranch}`
      ).code;
      if (switchBranchCode !== 0) {
        throw new Error(`切换分支为 ${currentBranch} 时出现错误`);
      }
    }
    let latestCommitID = shelljs.exec(`git log --format="%H" -n 1`, { silent: true }).stdout.trim();
    let lintLog = lintLogDb.get(md5(currentBranch)).value();
    let diffFiles = '';
    if (lintLog || currentBranch === 'master') {
      let baseCheckCommitID = '';
      if (currentBranch === 'master' && !lintLog) {
        console.log(`取 master 分支倒数第二次提交为对比基准`);
        // 如果 master 分支没有检测记录，就取 master 分支倒数第二次提交为对比基准
        // 只有第一次运行检测脚本才会出现此情况，考虑效率，选取倒数第二次，也可以是倒数第三次或其他任意一次
        let lastSecondCommitID = shelljs.exec(`git log --format="%H" -n 2 | tail -1`, { silent: true }).stdout.trim();
        baseCheckCommitID = lastSecondCommitID;
      } else {
        console.log(`从 lint.log.json 获取当前分支上次 lint 通过的记录`);
        baseCheckCommitID = lintLog.commitID;
      }
      if (!baseCheckCommitID) {
        throw new Error(`获取不到 baseCheckCommitID`);
      }
      console.log(`baseCheckCommitID = ${baseCheckCommitID}`);
      diffFiles = shelljs
        .exec(`git diff ${baseCheckCommitID} ${latestCommitID} --name-only`, { silent: true })
        .stdout.trim();
    } else {
      // 如果是非 master 分支，并且没有检测记录，就取当前分支与 master 分支的差异做检测
      console.log(`取当前分支与 master 分支的差异做检测`);
      diffFiles = shelljs.exec(`git diff master..${currentBranch} --name-only`, { silent: true }).stdout.trim();
    }
    console.log(`------ diff files ------\n${diffFiles}\n------ diff files ------`);
    let fileList = [];
    diffFiles.split('\n').forEach(function(v) {
      v = path.join(process.cwd(), v);
      if (!v.match(ignorePattern) || !ignorePattern) {
        fileList.push(v);
      }
    });
    db.set('files', fileList).write();

    let lintTime = moment().format('YYYY-MM-DD HH:mm:ss');
    return {
      branch: currentBranch,
      commitID: latestCommitID,
      lintTime: lintTime,
    };
  },
  // 更新 lint 记录
  updateLintLog: function(lintRes) {
    let adapter = new FileSync(lintLogJSON);
    let db = low(adapter);
    db.set(md5(lintRes.branch), {
      branch: lintRes.branch,
      commitID: lintRes.commitID,
      lintTime: lintRes.lintTime,
    }).write();
    console.log(`${lintRes.branch} 分支最新的 lint 记录已经在 ${lintRes.lintTime} 更新为 ${lintRes.commitID}`);
  },
  // 删除无用的 lint 记录（把两周前的 lint 记录当做是无用的 lint 记录，也就是说如果一个分支两周没有活动，那么就删除此分支的 lint 记录）
  deleteUselessLintLog: function() {
    console.log(`开始检测并删除无用的 lint 记录`);

    let lintLogAdapter = new FileSync(lintLogJSON);
    let lintLogDb = low(lintLogAdapter);

    let lintLogs = lintLogDb.value();

    let twoWeeksAgo = moment().day(-14);

    for (let k in lintLogs) {
      if (moment(lintLogs[k].lintTime).unix() < twoWeeksAgo.unix()) {
        console.log(
          `正在删除分支 ${lintLogs[k].branch} 的无用 lint 记录，该分支最新的 lintTime 为 ${lintLogs[k].lintTime}`
        );
        lintLogDb.unset(k).write();
      }
    }
    console.log(`已成功删除无用的 lint 记录`);
  },
};
