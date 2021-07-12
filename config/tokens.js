let tokens = require('@nycopportunity/growingup-patterns/config/tokens');

// Fix the tokens output path to prevent the watch script from firing multiple times.
tokens.output = `"${process.env.PWD}/src/config/_tokens.scss"`;

tokens.colors['color-orange'] = '#FA660A';
tokens.colors['color-blue-dark'] = '#2E4F91';
tokens.colors['color-purple'] = '#C1408B';
tokens.colors['color-purple-dark'] = '#9F2D71';
tokens.colors['color-red'] = '#FB5159';
tokens.colors['color-yellow'] = '#FB5159';
tokens.colors['color-yellow'] = '#FDB240';
tokens.colors['color-yellow-light'] = '#FED77C';

tokens['colors-default']['color-primary'] = 'color-purple-dark';
// tokens['colors-default']['color-secondary'] = ''
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
  'lgbtq': {
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
  }
};

module.exports = tokens;
