#!/usr/bin/env node

/**
 * Dependencies
 */

const fs = require('fs');
const cnsl = require('@nycopportunity/pttrn/bin/util/console');
const alerts = require('@nycopportunity/pttrn/config/alerts');

const global = require('../config/global');
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

    let cat = []
    let pop = []
    let dir = `${global.dist}/data`
    let servciesJson = `${dir}/services.json`;
    let termsJson = `${dir}/terms.json`;
    let population = 'config/population.json'

    for (let i = services.length - 1; i >= 0; i--) {
      let service = services[i];

      /**
       * Create service view
       */
      let template = 'src/slm/services/service.slm';
      let data = fs.readFileSync(template, 'utf8');
      let slug = createSlug(service.title);
      let write = `src/views/services/${slug}.slm`;

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

      service.categories.map(category => {
        category.slug = createSlug(category.name)
        cat.push(category)
      })

      service.population.map(people => {
        people.slug = createSlug(people.name)
        pop.push(people)
      })

      json.push(srvc);
    }

    const unique = (arr, key) => [...new Map(arr.map(item => [item[key], item])).values()];

    let terms = [
      {
        name: "Type of Support",
        slug: "cat",
        programs: unique(cat, 'id')
      },
      {
        name: "People Served",
        slug: "pop",
        programs: unique(pop, 'id')
      }
    ];

    /**
     * Write the services json
     */

    if (!fs.existsSync(`${dir}`)) {
      fs.mkdirSync(dir, {recursive: true});
    }

    fs.writeFileSync(servciesJson, JSON.stringify(json));
    fs.writeFileSync(termsJson, JSON.stringify(terms));
    // fs.writeFileSync(population, JSON.stringify(unique(pop, 'id')));

    cnsl.success(`${alerts.str.path(servciesJson)} was made.`);
    cnsl.success(`${alerts.str.path(termsJson)} was made.`);
    // cnsl.success(`${alerts.str.path(population)} was made.`);
  },
};
