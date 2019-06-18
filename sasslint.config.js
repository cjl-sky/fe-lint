/**
 * 标准的 .sass-lint.yml 格式文件转换为 json 格式文件即可
 */
module.exports = {
  files: {
    include: '**/*.scss',
    ignore: [], // 使用 gulp 做 ignore 处理即可，无需使用此参数做 ignore 处理
  },
  options: {
    formatter: 'stylish',
    'merge-default-rules': false,
  },
  rules: {
    'bem-depth': [
      0,
      {
        'max-depth': 1,
      },
    ],
    'brace-style': [
      2,
      {
        'allow-single-line': true,
      },
    ],
    'clean-import-paths': [
      2,
      {
        'filename-extension': false,
        'leading-underscore': false,
      },
    ],
    'empty-line-between-blocks': [
      0,
      {
        'ignore-single-line-rulesets': true,
      },
    ],
    'extends-before-declarations': 0,
    'extends-before-mixins': 0,
    'force-attribute-nesting': 0,
    'force-pseudo-nesting': 0,
    'hex-length': [
      2,
      {
        style: 'short',
      },
    ],
    'hex-notation': [
      0,
      {
        style: 'lowercase',
      },
    ],
    'mixin-name-format': [
      2,
      {
        'allow-leading-underscore': false,
        convention: 'hyphenatedlowercase',
      },
    ],
    'function-name-format': [
      0,
      {
        'allow-leading-underscore': false,
        convention: 'hyphenatedlowercase',
      },
    ],
    'id-name-format': [
      0,
      {
        convention: 'hyphenatedlowercase',
      },
    ],
    indentation: [
      2,
      {
        size: 2,
      },
    ],
    'leading-zero': [
      0,
      {
        include: false,
      },
    ],
    'mixins-before-declarations': 0,
    'nesting-depth': [
      2,
      {
        'max-depth': 4,
      },
    ],
    'no-color-keywords': 2,
    'no-debug': 2,
    'no-duplicate-properties': 0,
    'no-empty-rulesets': 0,
    'no-extends': 0,
    'no-ids': 0,
    'no-important': 0,
    'no-invalid-hex': 2,
    'no-mergeable-selectors': 0,
    'no-misspelled-properties': [
      0,
      {
        'extra-properties': [],
      },
    ],
    'no-qualifying-elements': [
      2,
      {
        'allow-element-with-attribute': true,
        'allow-element-with-class': true,
        'allow-element-with-id': false,
      },
    ],
    'no-trailing-zero': 2,
    'no-transition-all': 0,
    'no-url-protocols': 2,
    'no-vendor-prefixes': [
      0,
      {
        'additional-identifiers': [],
        'excluded-identifiers': [],
      },
    ],
    'placeholder-in-extend': 0,
    'placeholder-name-format': [
      0,
      {
        convention: 'hyphenatedlowercase',
      },
    ],
    'property-units': [
      2,
      {
        global: [
          'ch',
          'em',
          'ex',
          'rem',
          'cm',
          'in',
          'mm',
          'pc',
          'pt',
          'px',
          'q',
          'vh',
          'vw',
          'vmin',
          'vmax',
          'deg',
          'grad',
          'rad',
          'turn',
          'ms',
          's',
          'Hz',
          'kHz',
          'dpi',
          'dpcm',
          'dppx',
          '%',
        ],
        'per-property': {},
      },
    ],
    quotes: [
      0,
      {
        style: 'double',
      },
    ],
    'shorthand-values': [
      2,
      {
        'allowed-shorthands': [1, 2, 3],
      },
    ],
    'single-line-per-selector': 2,
    'space-after-bang': [
      2,
      {
        include: false,
      },
    ],
    'space-after-colon': [
      2,
      {
        include: true,
      },
    ],
    'space-after-comma': [
      2,
      {
        include: true,
      },
    ],
    'space-before-bang': [
      2,
      {
        include: true,
      },
    ],
    'space-before-brace': [
      2,
      {
        include: true,
      },
    ],
    'space-before-colon': 2,
    'space-between-parens': [
      2,
      {
        include: false,
      },
    ],
    'trailing-semicolon': 2,
    'url-quotes': 2,
    'zero-unit': 2,
  },
};
