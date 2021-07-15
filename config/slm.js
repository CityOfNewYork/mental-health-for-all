let package = require('../package.json');
let services = require('./services');

let remotes = {
  development: '',
  testing: 'https://nycopportunity.github.io/mhfa',
  production: package.homepage,
};

let banners = {
  'Crime Victim Assistance Program': 'a',
  'Family Justice Centers': 'b',
  'Programs for Survivors of Torture': 'c',
  'Mission: VetCheck': 'd',
  'The Trevor Project': 'e',
  'LGBTQ+ National Help Center': 'e',
  'Mental Health Services: Single Point of Access (SPOA)': 'f',
  'Mobile Crisis Teams': 'f',
  'Friendly Visiting and Friendly VOICES': 'g',
  'Geriatric Mental Health Initiative': 'g',
  'NYC Well': false,
  'NYC Care': 'f',
  'NYC Family Resource Centers': 'b',
  'Early Childhood Mental Health Network': 'h',
  'Health + Hospitals Comprehensive Psychiatric Emergency Services Program (CPEP)':
    'f',
  Clubhouses: 'd',
  'School Mental Health Services': 'b',
  'Family Counseling': 'h',
  'Assisted Outpatient Treatment (AOT)': 'f',
  'Drop-in centers for runaway and homeless youth': 'i',
  'Syringe Service Programs': 'j',
  'Naloxone Services': 'f',
  'Gotham Health Pride Centers': false,
  '3-2-1 Impact': 'f',
  'Mental Health Integrated in Primary Care': 'f',
  'Intensive Mobile Treatment': 'f',
};

module.exports = {
  name: 'Yonas',
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
  population: [
    {
      id: 1,
      name: 'Veterans',
      slug: 'veterans',
    },
    {
      id: 2,
      name: 'Families',
      slug: 'families',
    },
    {
      id: 3,
      name: 'LGBTQ',
      slug: 'lgntq',
    },
    {
      id: 4,
      name: 'Seniors',
      slug: 'seniors',
    },
    {
      id: 5,
      name: 'Children and Youth',
      slug: 'children-and-youth',
    },
    {
      id: 6,
      name: 'Everyone',
      slug: 'everyone',
    },
    {
      id: 7,
      name: 'Immigrants',
      slug: 'immigrants',
    },
    {
      id: 8,
      name: 'Adults',
      slug: 'adults',
    },
  ],

  /**
   * Functions
   */
  getSelectedCheckboxValues: (name, services) => {
    // const checkboxes = document.querySelectorAll(
    //   `input[name="${name}"]:checked`
    // );
    let values = ['Trauma Support', 'Veterans', 'Help With Anxiety'];
    // checkboxes.forEach((checkbox) => {
    //   values.push(checkbox.value);
    // });

    const filteredServices = services.filter((service) =>
      values.includes(service.taxonomy)
    );
    return filteredServices;
  },
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
