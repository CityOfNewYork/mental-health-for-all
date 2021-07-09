let tailwindcss = require('@nycopportunity/growingup-patterns/config/tailwind');
let tokens = require('./tokens');

tailwindcss.theme.colors = tokens.colors;
tailwindcss.theme.textColor = tokens.colors;
tailwindcss.theme.backgroundColor = tokens.colors;
tailwindcss.theme.borderColor = tokens.colors;
// tailwindcss.theme.fontFamily = tokens.fonts;

module.exports = tailwindcss;
