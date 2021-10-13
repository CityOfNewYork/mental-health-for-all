let tokens = require('@nycopportunity/growingup-patterns/config/tokens');
let banners = require('./banners');

/**
 * Fix the tokens output path to prevent the watch script from firing multiple times.
 */

tokens.output = `"${process.env.PWD}/src/config/_tokens.scss"`;

/**
 * Fonts
 */

tokens.fonts.main = '"https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;800&display=swap"';

/**
 * Get banner letters from the banner assignment
 */

tokens.banners = [...new Set(Object.values(banners).filter(b => b))];

/**
 * Mental Health for All Colors. The double quotes prevent
 * Sass from interpreting them as actual css color values.
 */

tokens.colors = {
  '"coral"': '#F35C48', // Everyone
  '"green"': '#1A9D65', // Families
  '"teal"': '#0089A2', // LGBTQ New Yorkers
  '"blue"': '#154A94', // Campaign / Adults
  '"fuchsia"': '#3F289C', // Aging New Yorkers
  '"purple"': '#8A4CC7', // Immigrants
  '"slate"': '#51596B', // Veterans

  '"orange"': '#FA660A', // Campaign
  '"magenta"': '#C1408B', // Campaign
  '"magenta-dark"': '#9F2D71', // Campaign
  '"blue"': '#154A94', // Campaign / Adults
  '"red"': '#E93E51', // Campaign / Children and Youth
  '"yellow"': '#FDB714', // Campaign
  '"yellow-light"': '#FED77C', // Campaign

  '"black"': '#333',
  '"white"': '#FFF',
  '"gray"': '#999',
  '"gray-light"': '#EEE',
  '"transparent"': 'transparent',
  '"shadow"': 'rgba(0, 0, 0, .2)'
};

tokens.colors['primary'] = tokens.colors['"magenta"'];
tokens.colors['secondary'] = tokens.colors['"magenta-dark"'];

tokens['colors-default']['color-primary'] = '"magenta"';
tokens['colors-default']['color-secondary'] = '"magenta-dark"';
tokens['colors-default']['color-background'] = '"white"';
tokens['colors-default']['color-background-shade'] = '"gray-light"';
tokens['colors-default']['color-background-footer'] = '"yellow-light"';
tokens['colors-default']['color-text'] = '"black"';
tokens['colors-default']['color-text-invert'] = '"white"';
tokens['colors-default']['color-text-link'] = '"magenta"';
tokens['colors-default']['color-text-weak'] = '"gray"';
tokens['colors-default']['color-error'] = '"red"';

let textWhite = tokens.colors[tokens['colors-default']['color-text-invert']];
let textBlack = tokens.colors[tokens['colors-default']['color-text']];

tokens.populations = {
  'everyone': {
    'text': textWhite,
    'primary': tokens.colors['"coral"']
  },
  'children-and-youth': {
    'text': textWhite,
    'primary': tokens.colors['"red"']
  },
  'families': {
    'text': textWhite,
    'primary': tokens.colors['"green"']
  },
  'lgbtq-new-yorkers': {
    'text': textWhite,
    'primary': tokens.colors['"teal"']
  },
  'immigrants': {
    'text': textWhite,
    'primary': tokens.colors['"blue"']
  },
  'adults': {
    'text': textWhite,
    'primary': tokens.colors['"fuchsia"']
  },
  'aging-new-yorkers': {
    'text': textWhite,
    'primary': tokens.colors['"purple"']
  },
  'veterans': {
    'text': textWhite,
    'primary': tokens.colors['"slate"']
  },
  'magenta': {
    'text': textWhite,
    'primary': tokens.colors['"magenta"']
  },
  'orange': {
    'text': textWhite,
    'primary': tokens.colors['"orange"']
  },
  'blue': {
    'text': textWhite,
    'primary': tokens.colors['"blue"']
  },
  'red': {
    'text': textWhite,
    'primary': tokens.colors['"red"']
  },
  'yellow': {
    'text': textBlack,
    'primary': tokens.colors['"yellow"']
  },
  'cat': {
    'text': textWhite,
    'primary': tokens.colors['"magenta"']
  },
  'pop': {
    'text': textWhite,
    'primary': tokens.colors['"magenta"']
  }
};

/**
 * Delete Growing Up NYC color tokens
 */

delete tokens['colors-baby'];
delete tokens['colors-toddler'];
delete tokens['colors-pre-schooler'];
delete tokens['colors-grade-schooler'];
delete tokens['colors-pre-teen'];
delete tokens['colors-teen'];
delete tokens['colors-young-adult'];

/**
 * Update screens to NYCO standard
 */

tokens.screens = {
  'xlarge': '1200px',
  'large': '1112px',
  'medium': '768px',
  'mobile': '480px',
  'small': '400px',
  // Max width is discouraged over min width but this offset
  // is needed when using it to avoid the pixel gap.
  'max-width-offset': '0.02px'
};

module.exports = tokens;
