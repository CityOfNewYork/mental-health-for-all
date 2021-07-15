let package = require('../package.json');
/**
 * Config
 */

module.exports = {
  development: '',
  testing: 'https://github.com/NYCOpportunity/mhfa.git',
  production: package.repository.url,
};
