/**
 * Config
 *
 * @type {Object}
 */
module.exports = {
  /**
   * Prefix to prepend to optimized svgs
   *
   * @type {String}
   */
  prefix: 'mhfa-',

  /**
   * Plugin options for SVGO
   *
   * @source https://github.com/svg/svgo#what-it-can-do
   */
  svgo: {
    convertPathData: false,
  },

  /**
   * Plugin options for svgstore
   *
   * @source https://github.com/svgstore/svgstore#options
   */
  svgstore: {
    /** Filename of the sprite. It will not use the prefix defined above. */
    file: 'svg/svgs.svg'
  }
};