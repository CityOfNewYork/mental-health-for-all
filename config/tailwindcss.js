let tailwindcss = require('@nycopportunity/growingup-patterns/config/tailwind');
let tokens = require('./tokens');

tailwindcss.theme.colors = tokens.colors;
tailwindcss.theme.textColor = tokens.colors;
tailwindcss.theme.backgroundColor = tokens.colors;
tailwindcss.theme.borderColor = tokens.colors;

tailwindcss.theme.screens = {
  'mobile-only': {
    'max': `${parseInt(tokens.screens['small']) - parseFloat(tokens.screens['max-width-offset'])}px` // Max widths should always use the offset
  },
  'mobile':      { 'min': tokens.screens['small']  },
  'tablet':      { 'min': tokens.screens['medium'] },
  'desktop':     { 'min': tokens.screens['large']  },
  'desktop-lg':  { 'min': tokens.screens['xlarge'] }
};

module.exports = tailwindcss;
