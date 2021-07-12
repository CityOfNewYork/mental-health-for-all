#!/usr/bin/env node

/**
 * Dependencies
 */

const fs = require('fs');
const cnsl = require('@nycopportunity/pttrn/bin/util/console');
const alerts = require('@nycopportunity/pttrn/config/alerts');

const services = require('../dist/data/services.json');

const createSlug = (s) => s
  .toLowerCase()
  .replace(/[^0-9a-zA-Z - _]+/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')

/**
 * Export our methods
 *
 * @type {Object}
 */
module.exports = {
  run: async () => {
    for (let i = services.length - 1; i >= 0; i--) {
      let service = services[i];
      let template = 'src/slm/services/main.slm';
      let data = fs.readFileSync(template, 'utf8');

      data = data
        .replace(/{{ SERVICE_TITLE }}/g, service.title)
        .replace('{{ SERVICE_SLUG }}', createSlug(service.title));

      let write = `src/views/programs/${createSlug(service.title)}.slm`;

      // if (!fs.existsSync(write)) {
        await fs.writeFileSync(write, data);

        cnsl.success(`${alerts.str.path(write)} was made.`);
      // } else {
        // cnsl.error(`${alerts.str.path(write)} already exists.`);
      // }
    }
  }
};
