/**
 * 此文件与标准的 .eslintrc 配置文件有微小差异，请注意
 */

module.exports = {
  plugins: ['html', 'xss', 'import'],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  // globals 是数组而不是对象
  globals: [
    'chai',
    'expect',
    'describe',
    'beforeEach',
    'sinon',
    'it',
    'lodash',
    'Vue',
    '$',
    'jQuery',
    '_',
    'Swiper',
    'wx',
  ],
  // 此处是 envs 而不是 env
  envs: ['browser', 'es6', 'node'],
  // rules 是数组而不是对象
  rules: {
    'block-spacing': [2, 'always'],
    camelcase: [
      2,
      {
        properties: 'never',
      },
    ],
    'comma-dangle': [0, 'never'],
    'comma-spacing': [
      2,
      {
        before: false,
        after: true,
      },
    ],
    'comma-style': [2, 'last'],
    'func-call-spacing': [2, 'never'],
    'key-spacing': [
      2,
      {
        beforeColon: false,
        afterColon: true,
      },
    ],
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
      },
    ],
    'keyword-spacing': [
      2,
      {
        before: true,
        after: true,
      },
    ],
    'no-alert': 0,
    'no-console': process.env.noconsole ? 2 : 0,
    'no-constant-condition': [
      2,
      {
        checkLoops: false,
      },
    ],
    'no-debugger': 2,
    'no-delete-var': 2,
    'no-eval': 2,
    'no-global-assign': 2,
    'no-redeclare': 2,
    'no-tabs': 2,
    'no-trailing-spaces': 2,
    'no-undef': process.env.ignorenoundef ? 0 : 2,
    'no-undef-init': 2,
    'no-unused-vars': [
      0,
      {
        vars: 'all',
        args: 'none',
      },
    ],
    'no-with': 2,
    quotes: [0, 'single'],
    'rest-spread-spacing': [2, 'never'],
    'semi-spacing': [
      2,
      {
        before: false,
        after: true,
      },
    ],
    'spaced-comment': [
      'error',
      'always',
      {
        line: {
          markers: ['/'],
          exceptions: ['-', '+'],
        },
        block: {
          markers: ['!'],
          exceptions: ['*'],
          balanced: true,
        },
      },
    ],
    'space-infix-ops': 2,
    'xss/no-mixed-html': 0,
    'yield-star-spacing': [2, 'both'],
    'import/no-commonjs': process.env.nocommonjs ? 2 : 0,
    'import/no-amd': process.env.noamd ? 2 : 0,
  },
};
