#!/usr/bin/env node

/**
 * Dependencies
 */

const fs = require('fs');
const cnsl = require('@nycopportunity/pttrn/bin/util/console');
const alerts = require('@nycopportunity/pttrn/config/alerts');

const services = require('../config/services');

const createSlug = (s) =>
  s
    .toLowerCase()
    .replace(/[^0-9a-zA-Z - _]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const card = {
  subtitle: '',
  title: '',
  programProvider: '',
  body: '',
  link: '',
  featured: '',
  categories: {},
  population: {},
};

/**
 * Export our methods
 *
 * @type {Object}
 */
module.exports = {
  run: async () => {
    let json = [];
    let servciesJson = 'dist/data/services.json';

    for (let i = services.length - 1; i >= 0; i--) {
      let service = services[i];

      /**
       * Create service view
       */
      let template = 'src/slm/services/service.slm';
      let data = fs.readFileSync(template, 'utf8');
      let slug = createSlug(service.title);
      let write = `src/views/programs/${slug}.slm`;

      data = data
        .replace(/{{ SERVICE_TITLE }}/g, service.title)
        .replace('{{ SERVICE_SLUG }}', slug);

      // if (!fs.existsSync(write)) {
      await fs.writeFileSync(write, data);

      cnsl.success(`${alerts.str.path(write)} was made.`);
      // } else {
      // cnsl.error(`${alerts.str.path(write)} already exists.`);
      // }

      /**
       * Build card data for services.json
       */

      let srvc = {};

      Object.keys(card).map((key) => {
        if (key === 'body') {
          srvc[key] = service['subtitle'];
        } else {
          srvc[key] = service[key];
        }
      });

      json.push(srvc);
    }

    /**
     * Write the services json
     */

    fs.writeFileSync(servciesJson, JSON.stringify(json));

    cnsl.success(`${alerts.str.path(servciesJson)} was made.`);
  },
};
