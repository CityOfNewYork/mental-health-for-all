let package = require('../package.json');

/**
 * Config
 */

module.exports = {
  'development': '',
  'testing': 'https://github.com/NYCOpportunity/mhfa',
  'production': package.repository.url
};