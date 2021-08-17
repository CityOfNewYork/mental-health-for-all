/**
 * Dependencies
 */

const nodeResolve = require('@rollup/plugin-node-resolve'); // Locate modules using the Node resolution algorithm, for using third party modules in node_modules.
const replace = require('@rollup/plugin-replace');          // Replace content while bundling.
const vue = require('rollup-plugin-vue');                   // Adds .vue file import support
const json = require('@rollup/plugin-json');                // Adds .json file import support

let tokens = require('./tokens');
let slm = require('./slm');
let global = require('./global');

/**
 * Base module configuration. Refer to the package for details on the available options.
 *
 * @source https://rollupjs.org
 *
 * @type {Object}
 */
const rollup = {
  sourcemap: 'inline',
  format: 'iife',
  strict: true,
};

/**
 * Plugin configuration. Refer to the package for details on the available options.
 *
 * @source https://github.com/rollup/plugins
 *
 * @type {Object}
 */
let plugins = [
  replace({
    'preventAssignment': true,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.ROOT': `'${slm.root}'`,
    'SCREEN_X_LARGE': parseInt(tokens.screens.xlarge),
    'SCREEN_LARGE': parseInt(tokens.screens.large),
    'SCREEN_MEDIUM': parseInt(tokens.screens.medium),
    'SCREEM_SMALL': parseInt(tokens.screens.small)
  }),
  nodeResolve.nodeResolve({
    browser: true,
    moduleDirectories: [
      'node_modules'
    ]
  }),
  json(),
  vue(),
];

/**
 * ES Module Exports
 *
 * @type {Array}
 */
module.exports = [
  {
    input: `${process.env.PWD}/src/js/default.js`,
    output: [
      {
        name: 'Default',
        file: `${process.env.PWD}/${global.dist}/js/default.js`,
        sourcemap: rollup.sourcemap,
        format: rollup.format,
        strict: rollup.strict,
      },
    ],
    plugins: plugins,
    devModule: true,
  },
  {
    input: `${process.env.PWD}/src/js/programs.js`,
    output: [
      {
        name: 'Programs',
        file: `${process.env.PWD}/${global.dist}/js/programs.js`,
        sourcemap: false,
        format: rollup.format,
        strict: rollup.strict,
      },
    ],
    plugins: plugins,
    devModule: true,
  },
];
