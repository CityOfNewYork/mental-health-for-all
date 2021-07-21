'use strict';

import Toggle from '@nycopportunity/pttrn-scripts/src/toggle/toggle';
import Icons from '@nycopportunity/pttrn-scripts/src/icons/icons';
import TranslateElement from '@nycopportunity/pttrn-scripts/src/google-translate-element/google-translate-element';
import StaticColumn from './staticColumn';
import TextRotation from './textRotation';

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

  staticColumn() {
    return new StaticColumn();
  }

  textRotation() {
    return new TextRotation();
  }

  translateElement() {
    new TranslateElement(document.querySelector(TranslateElement.selector));
  }
}

export default Default;
