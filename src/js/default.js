'use strict';

import Toggle from '@nycopportunity/pttrn-scripts/src/toggle/toggle';
import Icons from '@nycopportunity/pttrn-scripts/src/icons/icons';
class Default {
  constructor() {}

  toggle() {
    return new Toggle();
  }
  accordion() {
    return new Toggle({
      selector: '[data-js*="accordion"]',
      after: (toggle) => {
        toggle.element.parentNode.classList.toggle('is-expanded');
      },
    });
  }
  icons(path) {
    return new Icons(path);
  }
}
export default Default;

// class Default {
//   constructor() {}
// }
