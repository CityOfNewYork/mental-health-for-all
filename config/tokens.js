let tokens = require('@nycopportunity/growingup-patterns/config/tokens');

// Fix the tokens output path to prevent the watch script from firing multiple times.
tokens.output = `"${process.env.PWD}/src/config/_tokens.scss"`;

/**
 * Mental Health for All Colors
 */

tokens.colors['color-orange'] = '#FA660A';
tokens.colors['color-blue-dark'] = '#154A94';
tokens.colors['color-purple'] = '#C1408B';
tokens.colors['color-purple-dark'] = '#9F2D71';
tokens.colors['color-purple-light'] = '#ECC8DE';
tokens.colors['color-red'] = '#E93E51';
tokens.colors['color-yellow'] = '#FDB714';
tokens.colors['color-yellow-light'] = '#FFCB68';

// #378e27 Green
// #621ac1 Pink

tokens.colors['transparent'] = 'transparent';

tokens['colors-default']['color-primary'] = 'color-purple-dark';
tokens['colors-default']['color-secondary'] = 'color-orange';
// tokens['colors-default']['color-background'] = ''
// tokens['colors-default']['color-background-shade'] = ''
// tokens['colors-default']['color-background-footer'] = ''
// tokens['colors-default']['color-text'] = ''
// tokens['colors-default']['color-text-invert'] = ''
// tokens['colors-default']['color-text-link'] = ''
// tokens['colors-default']['color-text-weak'] = ''
// tokens['colors-default']['color-error'] = ''

tokens.populations = {
  'veterans': {
    'primary': tokens.colors['color-orange'],
    'secondary': tokens.colors['color-orange']
  },
  'children-and-youth': {
    'primary': tokens.colors['color-blue-dark'],
    'secondary': tokens.colors['color-blue-dark']
  },
  'lgbtq-new-yorkers': {
    'primary': tokens.colors['color-purple'],
    'secondary': tokens.colors['color-purple']
  },
  'seniors': {
    'primary': tokens.colors['color-red'],
    'secondary': tokens.colors['color-red']
  },
  'immigrants': {
    'primary': tokens.colors['color-light-green'],
    'secondary': tokens.colors['color-light-green']
  },
  'everyone': {
    'primary': tokens.colors['color-green'],
    'secondary': tokens.colors['color-green']
  },
  'adults': {
    'primary': tokens.colors['color-dark-gray'],
    'secondary': tokens.colors['color-dark-gray']
  },
  'families': {
    'primary': tokens.colors['color-pink'],
    'secondary': tokens.colors['color-pink']
  },
  'primary': {
    'primary': tokens.colors['color-purple'],
    'secondary': tokens.colors['color-purple']
  },
  'secondary': {
    'primary': tokens.colors['color-orange'],
    'secondary': tokens.colors['color-orange']
  },
  'cat': {
    'primary': tokens.colors['color-purple'],
    'secondary': tokens.colors['color-purple']
  },
  'pop': {
    'primary': tokens.colors['color-purple'],
    'secondary': tokens.colors['color-purple']
  }
};

module.exports = tokens;
