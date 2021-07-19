let package = require('../package.json');
let services = require('./services');
let population = require('./population.json')

let remotes = {
  development: '',
  testing: 'https://nycopportunity.github.io/mhfa',
  production: package.homepage,
};

let banners = {
  'The Crime Victim Assistance Program (CVAP)': 'a',
  'Family Justice Centers': 'b',
  'Program for Survivors of Torture': 'c',
  'Mission: VetCheck': 'd',
  'The Trevor Project': 'e',
  'LGBT National Help Center': 'e',
  'Single Point of Access (SPOA)': 'f',
  'Mobile crisis teams': 'f',
  'Friendly Visiting and Friendly VOICES': 'g',
  'Geriatric Mental Health Initiative': 'g',
  'NYC Well': false,
  'NYC Care': 'f',
  'NYC Family Resource Centers': 'b',
  'Early Childhood Mental Health Network': 'h',
  'Comprehensive Psychiatric Emergency Services Program (CPEP)':'f',
  'Clubhouses': 'd',
  'School Mental Health Services': 'b',
  'Family Counseling': 'h',
  'Assisted Outpatient Treatment (AOT)': 'f',
  'Drop-in Centers for Runaway and Homeless Youth': 'i',
  'Syringe Service Programs': 'j',
  'Naloxone': 'f',
  'Gotham Pride Health Centers': false,
  '3-2-1 Impact': 'f',
  'Mental Health Integrated in Primary Care': 'f',
  'Intensive Mobile Treatment': 'f',
};

services.map(s => {
  s.banner = banners[s.title];

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
