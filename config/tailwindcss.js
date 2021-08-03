let tailwindcss = require('@nycopportunity/growingup-patterns/config/tailwind');
let tokens = require('./tokens');

/**
 * Rebuild color token keys and remove double quotes
 */

let colors = {};
let keys = Object.keys(tokens.colors);

for (let index = 0; index < keys.length; index++) {
  let key = keys[index];

  colors[key.replace(/"/g, '')] = tokens.colors[key];
}

/**
 * Set the color settings
 */

tailwindcss.theme.colors = colors;
tailwindcss.theme.textColor = colors;
tailwindcss.theme.backgroundColor = colors;
tailwindcss.theme.borderColor = colors;

/**
 * Set responsive screen widths
 */

tailwindcss.theme.screens = {
  'mobile-only': {
    'max': `${parseInt(tokens.screens['small']) - parseFloat(tokens.screens['max-width-offset'])}px` // Max widths should always use the offset
  },
  'mobile':     { 'min': tokens.screens['small']  },
  'tablet':     { 'min': tokens.screens['medium'] },
  'desktop':    { 'min': tokens.screens['large']  },
  'desktop-lg': { 'min': tokens.screens['xlarge'] },
  'tall':       { 'raw': '(min-height: 600px)' }
};

tailwindcss.purge = {
  enabled: true,
  content: [
    './dist/**/*.html',
    './src/views/**/*.slm',
    './src/views/**/*.vue'
  ]
};

module.exports = tailwindcss;
