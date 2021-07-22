let package = require('../package.json');
let services = require('./services');
let banners = require('./banners');
let substanceAbuse = require('./substance-abuse');
let aboutUs = require('./about-us');
let population = require('./population.json');

let remotes = {
  development: '',
  testing: 'https://nycopportunity.github.io/mhfa',
  production: package.homepage,
};

services.map(s => {
  s.banner = banners[s.title];

  s.body.substanceAbuse = substanceAbuse;

  s.body.substanceAbuse.content = substanceAbuse.content
    .replace('{{ this.root }}', remotes[process.env.NODE_ENV]);

  return s;
});

module.exports = {
  name: '',
  process: {
    env: {
      NODE_ENV: process.env.NODE_ENV,
    },
  },
  root: remotes[process.env.NODE_ENV],
  services: services,
  programs: [
    'Trauma Support',
    'Veterans',
    'Children and Families',
    'LGBTQ New Yorkers',
    'Care for Serious Mental Illness',
    'Crisis Support',
    'Aging New Yorkers',
    'Grief Support',
    'Help with Anxiety',
    'Substance Use Services',
  ],
  population: population,
  aboutUs: aboutUs,
  generateClassName: (title) => {
    let className = `bg-${title.toLowerCase()}--secondary`;
    return className;
  },
  createSlug: (s) =>
    s
      .toLowerCase()
      .replace(/[^0-9a-zA-Z - _]+/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-'),
};
