module.exports = {
  env: {
    node: true,
    es6: true,
    browser: true
  },
  parser: '@babel/eslint-parser',
  extends: ['next/core-web-vitals', 'prettier',],
  parserOptions: {
    // Resolve Babel relative to this file and load Next's preset explicitly.
    // Without this, editor-integrated ESLint (which may run from a different
    // working directory) fails with:
    //   Parsing error: Cannot find module 'next/babel'
    requireConfigFile: false,
    babelOptions: {
      cwd: __dirname,
      presets: [require.resolve('next/babel')]
    },
    ecmaVersion: 11,
    sourceType: 'module',
    project: './jsconfig.json',
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/display-name': 'off',
    '@next/next/no-img-element': 'off',
    'react/no-unescaped-entities': 'off',
    'import/no-anonymous-default-export': 'off',

    // add new line above comment
    'lines-around-comment': 'off',

    // add new line above return
    'newline-before-return': 'off',

    // add new line below import
    'import/newline-after-import': [
      'error',
      {
        count: 1
      }
    ],

    // add new line after each var, const, let declaration
    'padding-line-between-statements': 'off'
  }
}
