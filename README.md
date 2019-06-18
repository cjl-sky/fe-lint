# fe-lint

## 介绍

fe-lint 为前端团队的代码规范检测工具

## 安装

全局安装即可

> 因为 fe-lint 依赖 Gulp, 需要全局安装一个 Gulp 才能正常运行.

```bash
npm install -g gulp git+ssh://git@github.com:cjl-sky/fe-lint.git
```

## 使用

> 目前 fe-lint 都是用于做整个仓库检测的，不需要为每个项目单独做检测配置，所以此处可以不用关心具体配置用法

1、在需要使用代码规范检测的项目的 package.json 里添加以下 scripts 配置

```json
"scripts": {
    "test": "fe-lint"
}
```

2、添加代码规范配置文件

在项目静态目录下（与 package.json 同级）添加配置文件 `lint.config.json`，最基本的 `lint.config.json` 配置为：

```json
{
  "demo-project": ["**/src/**/*.js", "**/src/**/*.vue", "**/src/**/*.scss"]
}
```

## 注意事项

- 迭代时要维护好 unit test
- 提交代码后要注意 CI 平台、邮件是否有单测失败反馈
