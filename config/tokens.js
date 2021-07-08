let tokens = require('@nycopportunity/growingup-patterns/config/tokens');

// Fix the tokens output path to prevent the watch script from firing multiple times.
tokens.output = `"${process.env.PWD}/src/config/_tokens.scss"`;

module.exports = tokens;
