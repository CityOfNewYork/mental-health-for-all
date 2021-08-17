const global = require('./global');

/**
 * Config
 *
 * @type {Object}
 */
const sass = {
  sourceMapEmbed: true,
  includePaths: [
    `${process.env.PWD}/src/`,
    `${process.env.PWD}/node_modules/`,
    `${process.env.PWD}/node_modules/@nycopportunity/growingup-patterns/src/`
  ]
};

/**
 * Sass Export
 *
 * @type {Array}
 */
module.exports = [
  {
    file: `${process.env.PWD}/src/scss/default.scss`,
    outDir: `${process.env.PWD}/${global.dist}/css/`,
    outFile: 'default.css',
    sourceMapEmbed: sass.sourceMapEmbed,
    includePaths: sass.includePaths,
    devModule: true // This needs to be set if we want the module to be compiled during development
  }
];
