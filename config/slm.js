let package = require('../package.json');
let tokens = require('./tokens');
let services = require('./services');
let banners = require('./banners');
let substanceAbuse = require('./substance-abuse');
let population = require('./population.json');

let remotes = {
  development: '',
  testing: 'https://cityofnewyork.github.io/mental-health-for-all',
  staging: 'https://mentalhealthforall-stg.nyc.gov',
  production: 'https://mentalhealthforall.nyc.gov',
};

let gtag = {
  development: 'G-GCXGSB3MXE',
  testing: 'G-PHC0PCR8S3',
  staging: 'G-G87VSJNZ1M',
  production: 'G-CFPSFD534S'
};

services.map(s => {
  s.banner = banners[s.title];

  s.body.substanceAbuse = substanceAbuse;

  s.body.substanceAbuse.content = substanceAbuse.content
    .replace('{{ this.root }}', remotes[process.env.NODE_ENV]);

  return s;
});

module.exports = {
  name: package.nicename,
  description: package.description,
  process: {
    env: {
      NODE_ENV: process.env.NODE_ENV,
    },
  },
  root: remotes[process.env.NODE_ENV],
  gtag: gtag[process.env.NODE_ENV],
  tokens: tokens,
  services: services,
  serviceSectionLabels: {
    whatItIs: {
      label: 'What it is',
      color: 'orange'
    },
    whoItIsFor: {
      label: 'Who it’s for',
      color: 'magenta'
    },
    cost: {
      label: 'Cost',
      color: 'blue'
    },
    howToGetInTouch: {
      label: 'How to get in touch',
      color: 'red'
    },
    otherWaysToGetHelp: {
      label: 'Other ways to get help',
      color: 'yellow'
    }
  },
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
