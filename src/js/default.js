'use strict';

import Toggle from '@nycopportunity/pttrn-scripts/src/toggle/toggle';
import Icons from '@nycopportunity/pttrn-scripts/src/icons/icons';
import TranslateElement from '@nycopportunity/pttrn-scripts/src/google-translate-element/google-translate-element';
import Menu from '@nycopportunity/pattern-menu/src/menu';
import StaticColumn from './staticColumn';
import TextRotation from './textRotation';

class Default {
  constructor() {}

  toggle() {
    this.toggle = new Toggle();
    return this.toggle
  }

  toggleTrigger(selector) {
    // Use the toggle instance that the filters are using. It may be a different instance.

    // Symbolic element for toggle method
    this.trigger = document.createElement('button');
    this.trigger.classList.remove(this.toggle.settings.activeClass);
    this.trigger.setAttribute('aria-controls', selector);

    // Toggle the element. This will show it if the element is hidden or hide it if it is visible
    this.toggle.elementToggle(this.trigger, document.querySelector(selector), []);

  }

  accordion() {
    return new Toggle({
      selector: '[data-js*="accordion"]',
      after: (toggle) => {
        toggle.element.parentNode.classList.toggle('is-expanded');
      },
    });
  }

  banners() {
    window.addEventListener('load', () => {
      document.querySelectorAll('[data-js="lazy"]').forEach((i) => {
        i.classList.remove('not-loaded');
        i.classList.add('loaded');
      });
    });
  }

  icons(path) {
    return new Icons(path);
  }

  menu() {
    return new Menu();
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
