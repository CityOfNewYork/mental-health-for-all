let global = require('@nycopportunity/pttrn/config/global');

// This will override the global dist folder based on the Node ENV variable
if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'testing') {
  global.dist = process.env.NODE_ENV;
}

module.exports = global;
