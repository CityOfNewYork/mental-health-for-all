var Default = (function () {
  'use strict';

  /**
   * The Simple Toggle class. This will toggle the class 'active' and 'hidden'
   * on target elements, determined by a click event on a selected link or
   * element. This will also toggle the aria-hidden attribute for targeted
   * elements to support screen readers. Target settings and other functionality
   * can be controlled through data attributes.
   *
   * This uses the .matches() method which will require a polyfill for IE
   * https://polyfill.io/v2/docs/features/#Element_prototype_matches
   *
   * @class
   */
  class Toggle {
    /**
     * @constructor
     *
     * @param  {Object}  s  Settings for this Toggle instance
     *
     * @return {Object}     The class
     */
    constructor(s) {
      // Create an object to store existing toggle listeners (if it doesn't exist)
      if (!window.hasOwnProperty(Toggle.callback))
        window[Toggle.callback] = [];

      s = (!s) ? {} : s;

      this.settings = {
        selector: (s.selector) ? s.selector : Toggle.selector,
        namespace: (s.namespace) ? s.namespace : Toggle.namespace,
        inactiveClass: (s.inactiveClass) ? s.inactiveClass : Toggle.inactiveClass,
        activeClass: (s.activeClass) ? s.activeClass : Toggle.activeClass,
        before: (s.before) ? s.before : false,
        after: (s.after) ? s.after : false,
        valid: (s.valid) ? s.valid : false,
        focusable: (s.hasOwnProperty('focusable')) ? s.focusable : true,
        jump: (s.hasOwnProperty('jump')) ? s.jump : true
      };

      // Store the element for potential use in callbacks
      this.element = (s.element) ? s.element : false;

      if (this.element) {
        this.element.addEventListener('click', (event) => {
          this.toggle(event);
        });
      } else {
        // If there isn't an existing instantiated toggle, add the event listener.
        if (!window[Toggle.callback].hasOwnProperty(this.settings.selector)) {
          let body = document.querySelector('body');

          for (let i = 0; i < Toggle.events.length; i++) {
            let tggleEvent = Toggle.events[i];

            body.addEventListener(tggleEvent, event => {
              if (!event.target.matches(this.settings.selector))
                return;

              this.event = event;

              let type = event.type.toUpperCase();

              if (
                this[event.type] &&
                Toggle.elements[type] &&
                Toggle.elements[type].includes(event.target.tagName)
              ) this[event.type](event);
            });
          }
        }
      }

      // Record that a toggle using this selector has been instantiated.
      // This prevents double toggling.
      window[Toggle.callback][this.settings.selector] = true;

      return this;
    }

    /**
     * Click event handler
     *
     * @param  {Event}  event  The original click event
     */
    click(event) {
      this.toggle(event);
    }

    /**
     * Input/select/textarea change event handler. Checks to see if the
     * event.target is valid then toggles accordingly.
     *
     * @param  {Event}  event  The original input change event
     */
    change(event) {
      let valid = event.target.checkValidity();

      if (valid && !this.isActive(event.target)) {
        this.toggle(event); // show
      } else if (!valid && this.isActive(event.target)) {
        this.toggle(event); // hide
      }
    }

    /**
     * Check to see if the toggle is active
     *
     * @param  {Object}  element  The toggle element (trigger)
     */
    isActive(element) {
      let active = false;

      if (this.settings.activeClass) {
        active = element.classList.contains(this.settings.activeClass);
      }

      // if () {
        // Toggle.elementAriaRoles
        // TODO: Add catch to see if element aria roles are toggled
      // }

      // if () {
        // Toggle.targetAriaRoles
        // TODO: Add catch to see if target aria roles are toggled
      // }

      return active;
    }

    /**
     * Get the target of the toggle element (trigger)
     *
     * @param  {Object}  el  The toggle element (trigger)
     */
    getTarget(element) {
      let target = false;

      /** Anchor Links */
      target = (element.hasAttribute('href')) ?
        document.querySelector(element.getAttribute('href')) : target;

      /** Toggle Controls */
      target = (element.hasAttribute('aria-controls')) ?
        document.querySelector(`#${element.getAttribute('aria-controls')}`) : target;

      return target;
    }

    /**
     * The toggle event proxy for getting and setting the element/s and target
     *
     * @param  {Object}  event  The main click event
     *
     * @return {Object}         The Toggle instance
     */
    toggle(event) {
      let element = event.target;
      let target = false;
      let focusable = [];

      event.preventDefault();

      target = this.getTarget(element);

      /** Focusable Children */
      focusable = (target) ?
        target.querySelectorAll(Toggle.elFocusable.join(', ')) : focusable;

      /** Main Functionality */
      if (!target) return this;
      this.elementToggle(element, target, focusable);

      /** Undo */
      if (element.dataset[`${this.settings.namespace}Undo`]) {
        const undo = document.querySelector(
          element.dataset[`${this.settings.namespace}Undo`]
        );

        undo.addEventListener('click', (event) => {
          event.preventDefault();
          this.elementToggle(element, target);
          undo.removeEventListener('click');
        });
      }

      return this;
    }

    /**
     * Get other toggles that might control the same element
     *
     * @param   {Object}    element  The toggling element
     *
     * @return  {NodeList}           List of other toggling elements
     *                               that control the target
     */
    getOthers(element) {
      let selector = false;

      if (element.hasAttribute('href')) {
        selector = `[href="${element.getAttribute('href')}"]`;
      } else if (element.hasAttribute('aria-controls')) {
        selector = `[aria-controls="${element.getAttribute('aria-controls')}"]`;
      }

      return (selector) ? document.querySelectorAll(selector) : [];
    }

    /**
     * Hide the Toggle Target's focusable children from focus.
     * If an element has the data-attribute `data-toggle-tabindex`
     * it will use that as the default tab index of the element.
     *
     * @param   {NodeList}  elements  List of focusable elements
     *
     * @return  {Object}              The Toggle Instance
     */
    toggleFocusable(elements) {
      elements.forEach(element => {
        let tabindex = element.getAttribute('tabindex');

        if (tabindex === '-1') {
          let dataDefault = element
            .getAttribute(`data-${Toggle.namespace}-tabindex`);

          if (dataDefault) {
            element.setAttribute('tabindex', dataDefault);
          } else {
            element.removeAttribute('tabindex');
          }
        } else {
          element.setAttribute('tabindex', '-1');
        }
      });

      return this;
    }

    /**
     * Jumps to Element visibly and shifts focus
     * to the element by setting the tabindex
     *
     * @param   {Object}  element  The Toggling Element
     * @param   {Object}  target   The Target Element
     *
     * @return  {Object}           The Toggle instance
     */
    jumpTo(element, target) {
      // Reset the history state. This will clear out
      // the hash when the target is toggled closed
      history.pushState('', '',
        window.location.pathname + window.location.search);

      // Focus if active
      if (target.classList.contains(this.settings.activeClass)) {
        window.location.hash = element.getAttribute('href');

        target.setAttribute('tabindex', '0');
        target.focus({preventScroll: true});
      } else {
        target.removeAttribute('tabindex');
      }

      return this;
    }

    /**
     * The main toggling method for attributes
     *
     * @param  {Object}    element    The Toggle element
     * @param  {Object}    target     The Target element to toggle active/hidden
     * @param  {NodeList}  focusable  Any focusable children in the target
     *
     * @return {Object}               The Toggle instance
     */
    elementToggle(element, target, focusable = []) {
      let i = 0;
      let attr = '';
      let value = '';

      /**
       * Store elements for potential use in callbacks
       */

      this.element = element;
      this.target = target;
      this.others = this.getOthers(element);
      this.focusable = focusable;

      /**
       * Validity method property that will cancel the toggle if it returns false
       */

      if (this.settings.valid && !this.settings.valid(this))
        return this;

      /**
       * Toggling before hook
       */

      if (this.settings.before)
        this.settings.before(this);

      /**
       * Toggle Element and Target classes
       */

      if (this.settings.activeClass) {
        this.element.classList.toggle(this.settings.activeClass);
        this.target.classList.toggle(this.settings.activeClass);

        // If there are other toggles that control the same element
        this.others.forEach(other => {
          if (other !== this.element)
            other.classList.toggle(this.settings.activeClass);
        });
      }

      if (this.settings.inactiveClass)
        target.classList.toggle(this.settings.inactiveClass);

      /**
       * Target Element Aria Attributes
       */

      for (i = 0; i < Toggle.targetAriaRoles.length; i++) {
        attr = Toggle.targetAriaRoles[i];
        value = this.target.getAttribute(attr);

        if (value != '' && value)
          this.target.setAttribute(attr, (value === 'true') ? 'false' : 'true');
      }

      /**
       * Toggle the target's focusable children tabindex
       */

      if (this.settings.focusable)
        this.toggleFocusable(this.focusable);

      /**
       * Jump to Target Element if Toggle Element is an anchor link
       */

      if (this.settings.jump && this.element.hasAttribute('href'))
        this.jumpTo(this.element, this.target);

      /**
       * Toggle Element (including multi toggles) Aria Attributes
       */

      for (i = 0; i < Toggle.elAriaRoles.length; i++) {
        attr = Toggle.elAriaRoles[i];
        value = this.element.getAttribute(attr);

        if (value != '' && value)
          this.element.setAttribute(attr, (value === 'true') ? 'false' : 'true');

        // If there are other toggles that control the same element
        this.others.forEach((other) => {
          if (other !== this.element && other.getAttribute(attr))
            other.setAttribute(attr, (value === 'true') ? 'false' : 'true');
        });
      }

      /**
       * Toggling complete hook
       */

      if (this.settings.after)
        this.settings.after(this);

      return this;
    }
  }

  /** @type  {String}  The main selector to add the toggling function to */
  Toggle.selector = '[data-js*="toggle"]';

  /** @type  {String}  The namespace for our data attribute settings */
  Toggle.namespace = 'toggle';

  /** @type  {String}  The hide class */
  Toggle.inactiveClass = 'hidden';

  /** @type  {String}  The active class */
  Toggle.activeClass = 'active';

  /** @type  {Array}  Aria roles to toggle true/false on the toggling element */
  Toggle.elAriaRoles = ['aria-pressed', 'aria-expanded'];

  /** @type  {Array}  Aria roles to toggle true/false on the target element */
  Toggle.targetAriaRoles = ['aria-hidden'];

  /** @type  {Array}  Focusable elements to hide within the hidden target element */
  Toggle.elFocusable = [
    'a', 'button', 'input', 'select', 'textarea', 'object', 'embed', 'form',
    'fieldset', 'legend', 'label', 'area', 'audio', 'video', 'iframe', 'svg',
    'details', 'table', '[tabindex]', '[contenteditable]', '[usemap]'
  ];

  /** @type  {Array}  Key attribute for storing toggles in the window */
  Toggle.callback = ['TogglesCallback'];

  /** @type  {Array}  Default events to to watch for toggling. Each must have a handler in the class and elements to look for in Toggle.elements */
  Toggle.events = ['click', 'change'];

  /** @type  {Array}  Elements to delegate to each event handler */
  Toggle.elements = {
    CLICK: ['A', 'BUTTON'],
    CHANGE: ['SELECT', 'INPUT', 'TEXTAREA']
  };

  /**
   * The Icon module
   * @class
   */
  class Icons {
    /**
     * @constructor
     * @param  {String} path The path of the icon file
     * @return {object} The class
     */
    constructor(path) {
      path = (path) ? path : Icons.path;

      fetch(path)
        .then((response) => {
          if (response.ok)
            return response.text();
          else
            // eslint-disable-next-line no-console
            console.dir(response);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.dir(error);
        })
        .then((data) => {
          const sprite = document.createElement('div');
          sprite.innerHTML = data;
          sprite.setAttribute('aria-hidden', true);
          sprite.setAttribute('style', 'display: none;');
          document.body.appendChild(sprite);
        });

      return this;
    }
  }

  /** @type {String} The path of the icon file */
  Icons.path = 'svg/icons.svg';

  /**
   * Static column module
   * Similar to the general sticky module but used specifically when one column
   * of a two-column layout is meant to be sticky
   * @module modules/staticColumn
   * @see modules/stickyNav
   */

  class StaticColumn {
    constructor() {
      this._settings = {
        selector: StaticColumn.selector,
      };

      const stickyContent = document.querySelectorAll(
        `.${this._settings.selector}`
      );
      /**
       * Calculates the window position and sets the appropriate class on the element
       * @param {object} stickyContentElem - DOM node that should be stickied
       */
      this.assignStickyFeature(stickyContent);
    }

    /**
     * Iterate over elemets containing the class 'js-static'.
     * On page load, screenResize and scroll events, calls StaticColumn.calcWindowPos function .
     * @param {elements} stickyContent Element in chich the sticky effect will be applied
     */

    assignStickyFeature(stickyContent) {
      if (stickyContent) {
        stickyContent.forEach(function(stickyContentElem) {
          StaticColumn.calcWindowPos(stickyContentElem);
          /**
           * Add event listener for 'scroll'.
           * @function
           * @param {object} event - The event object
           */
          window.addEventListener(
            'scroll',
            function() {
              StaticColumn.calcWindowPos(stickyContentElem);
            },
            false
          );

          /**
           * Add event listener for 'resize'.
           * @function
           * @param {object} event - The event object
           */
          window.addEventListener(
            'resize',
            function() {
              StaticColumn.calcWindowPos(stickyContentElem);
            },
            false
          );
        });
      }
    }
  }

  /**
   * depending on elements postion in the page add and remove classes
   * @param {element} stickyContentElem an element with the class name 'js-static'
   */

  StaticColumn.calcWindowPos = function(stickyContentElem) {
    let elemTop = stickyContentElem.parentElement.getBoundingClientRect().top;
    let isPastBottom =
      window.innerHeight -
        stickyContentElem.parentElement.clientHeight -
        stickyContentElem.parentElement.getBoundingClientRect().top >
      0;

    // Sets element to position absolute if not scrolled to yet.
    // Absolutely positioning only when necessary and not by default prevents flickering
    // when removing the "is-bottom" class on Chrome
    if (elemTop > 0) {
      stickyContentElem.classList.add(StaticColumn.notStickyClass);
    } else {
      stickyContentElem.classList.remove(StaticColumn.notStickyClass);
    }
    if (isPastBottom) {
      stickyContentElem.classList.add(StaticColumn.bottomClass);
    } else {
      stickyContentElem.classList.remove(StaticColumn.bottomClass);
    }
  };

  StaticColumn.selector = 'js-static';
  StaticColumn.notStickyClass = 'is-not-sticky';
  StaticColumn.bottomClass = 'is-bottom';

  class Animations {
    constructor() {
      this._settings = {
        selector: Animations.selector,
        controller: Animations.controller,
        speed: Animations.speed,
      };

      const rotating = document.querySelectorAll(this._settings.selector);
      var terms = [];

      // Iterate over the element and add their textContent in an array
      rotating.forEach(function(term) {
        if (term.innerText.trim() !== '') {
          terms.push(term.innerText);
        }
      });

      Animations.rotateTerms(
        terms,
        this._settings.controller,
        this._settings.speed
      );
    }
  }

  /**
   * Accepts array of string and creates rotating loop for the duration of the time provided as a speed argument.
   * After every rotation calles the Animation.fadeInout function
   * @param {array} terms array of strings
   * @param {data-js} control the animation controlling element class
   * @param {number} speed animation speeed
   */

  Animations.rotateTerms = function(terms, control, speed) {
    const controller = document.querySelector(control);

    controller.innerText = terms[0].trim();
    Animations.fadeInOut(controller);

    var i = 1;
    setInterval(function() {
      if (i == terms.length) {
        i = 0;
      }
      controller.innerText = terms[i].trim();
      Animations.fadeInOut(controller);

      i++;
    }, 3000);
  };

  /**
   * After evey rotation adds and removes animate.css classes to fade in and fade out the strings
   * @param {element} controller
   */
  Animations.fadeInOut = function(controller) {
    controller.classList.add('fadeIn');

    setTimeout(function() {
      controller.classList.add('fadeOut');
      controller.classList.remove('fadeIn');
    }, 2000);
  };

  Animations.speed = 1500;

  Animations.selector = '[data-js*="rotate-text"]';

  Animations.controller = '[data-js*="rotate-controller"]';

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
      return new Animations();
    }
  }

  return Default;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy90b2dnbGUvdG9nZ2xlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy9pY29ucy9pY29ucy5qcyIsIi4uLy4uL3NyYy9qcy9zdGF0aWNDb2x1bW4uanMiLCIuLi8uLi9zcmMvanMvdGV4dFJvdGF0aW9uLmpzIiwiLi4vLi4vc3JjL2pzL2RlZmF1bHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFRoZSBTaW1wbGUgVG9nZ2xlIGNsYXNzLiBUaGlzIHdpbGwgdG9nZ2xlIHRoZSBjbGFzcyAnYWN0aXZlJyBhbmQgJ2hpZGRlbidcbiAqIG9uIHRhcmdldCBlbGVtZW50cywgZGV0ZXJtaW5lZCBieSBhIGNsaWNrIGV2ZW50IG9uIGEgc2VsZWN0ZWQgbGluayBvclxuICogZWxlbWVudC4gVGhpcyB3aWxsIGFsc28gdG9nZ2xlIHRoZSBhcmlhLWhpZGRlbiBhdHRyaWJ1dGUgZm9yIHRhcmdldGVkXG4gKiBlbGVtZW50cyB0byBzdXBwb3J0IHNjcmVlbiByZWFkZXJzLiBUYXJnZXQgc2V0dGluZ3MgYW5kIG90aGVyIGZ1bmN0aW9uYWxpdHlcbiAqIGNhbiBiZSBjb250cm9sbGVkIHRocm91Z2ggZGF0YSBhdHRyaWJ1dGVzLlxuICpcbiAqIFRoaXMgdXNlcyB0aGUgLm1hdGNoZXMoKSBtZXRob2Qgd2hpY2ggd2lsbCByZXF1aXJlIGEgcG9seWZpbGwgZm9yIElFXG4gKiBodHRwczovL3BvbHlmaWxsLmlvL3YyL2RvY3MvZmVhdHVyZXMvI0VsZW1lbnRfcHJvdG90eXBlX21hdGNoZXNcbiAqXG4gKiBAY2xhc3NcbiAqL1xuY2xhc3MgVG9nZ2xlIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBzICBTZXR0aW5ncyBmb3IgdGhpcyBUb2dnbGUgaW5zdGFuY2VcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgVGhlIGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzKSB7XG4gICAgLy8gQ3JlYXRlIGFuIG9iamVjdCB0byBzdG9yZSBleGlzdGluZyB0b2dnbGUgbGlzdGVuZXJzIChpZiBpdCBkb2Vzbid0IGV4aXN0KVxuICAgIGlmICghd2luZG93Lmhhc093blByb3BlcnR5KFRvZ2dsZS5jYWxsYmFjaykpXG4gICAgICB3aW5kb3dbVG9nZ2xlLmNhbGxiYWNrXSA9IFtdO1xuXG4gICAgcyA9ICghcykgPyB7fSA6IHM7XG5cbiAgICB0aGlzLnNldHRpbmdzID0ge1xuICAgICAgc2VsZWN0b3I6IChzLnNlbGVjdG9yKSA/IHMuc2VsZWN0b3IgOiBUb2dnbGUuc2VsZWN0b3IsXG4gICAgICBuYW1lc3BhY2U6IChzLm5hbWVzcGFjZSkgPyBzLm5hbWVzcGFjZSA6IFRvZ2dsZS5uYW1lc3BhY2UsXG4gICAgICBpbmFjdGl2ZUNsYXNzOiAocy5pbmFjdGl2ZUNsYXNzKSA/IHMuaW5hY3RpdmVDbGFzcyA6IFRvZ2dsZS5pbmFjdGl2ZUNsYXNzLFxuICAgICAgYWN0aXZlQ2xhc3M6IChzLmFjdGl2ZUNsYXNzKSA/IHMuYWN0aXZlQ2xhc3MgOiBUb2dnbGUuYWN0aXZlQ2xhc3MsXG4gICAgICBiZWZvcmU6IChzLmJlZm9yZSkgPyBzLmJlZm9yZSA6IGZhbHNlLFxuICAgICAgYWZ0ZXI6IChzLmFmdGVyKSA/IHMuYWZ0ZXIgOiBmYWxzZSxcbiAgICAgIHZhbGlkOiAocy52YWxpZCkgPyBzLnZhbGlkIDogZmFsc2UsXG4gICAgICBmb2N1c2FibGU6IChzLmhhc093blByb3BlcnR5KCdmb2N1c2FibGUnKSkgPyBzLmZvY3VzYWJsZSA6IHRydWUsXG4gICAgICBqdW1wOiAocy5oYXNPd25Qcm9wZXJ0eSgnanVtcCcpKSA/IHMuanVtcCA6IHRydWVcbiAgICB9O1xuXG4gICAgLy8gU3RvcmUgdGhlIGVsZW1lbnQgZm9yIHBvdGVudGlhbCB1c2UgaW4gY2FsbGJhY2tzXG4gICAgdGhpcy5lbGVtZW50ID0gKHMuZWxlbWVudCkgPyBzLmVsZW1lbnQgOiBmYWxzZTtcblxuICAgIGlmICh0aGlzLmVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZShldmVudCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGhlcmUgaXNuJ3QgYW4gZXhpc3RpbmcgaW5zdGFudGlhdGVkIHRvZ2dsZSwgYWRkIHRoZSBldmVudCBsaXN0ZW5lci5cbiAgICAgIGlmICghd2luZG93W1RvZ2dsZS5jYWxsYmFja10uaGFzT3duUHJvcGVydHkodGhpcy5zZXR0aW5ncy5zZWxlY3RvcikpIHtcbiAgICAgICAgbGV0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBUb2dnbGUuZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHRnZ2xlRXZlbnQgPSBUb2dnbGUuZXZlbnRzW2ldO1xuXG4gICAgICAgICAgYm9keS5hZGRFdmVudExpc3RlbmVyKHRnZ2xlRXZlbnQsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGlmICghZXZlbnQudGFyZ2V0Lm1hdGNoZXModGhpcy5zZXR0aW5ncy5zZWxlY3RvcikpXG4gICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5ldmVudCA9IGV2ZW50O1xuXG4gICAgICAgICAgICBsZXQgdHlwZSA9IGV2ZW50LnR5cGUudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICB0aGlzW2V2ZW50LnR5cGVdICYmXG4gICAgICAgICAgICAgIFRvZ2dsZS5lbGVtZW50c1t0eXBlXSAmJlxuICAgICAgICAgICAgICBUb2dnbGUuZWxlbWVudHNbdHlwZV0uaW5jbHVkZXMoZXZlbnQudGFyZ2V0LnRhZ05hbWUpXG4gICAgICAgICAgICApIHRoaXNbZXZlbnQudHlwZV0oZXZlbnQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVjb3JkIHRoYXQgYSB0b2dnbGUgdXNpbmcgdGhpcyBzZWxlY3RvciBoYXMgYmVlbiBpbnN0YW50aWF0ZWQuXG4gICAgLy8gVGhpcyBwcmV2ZW50cyBkb3VibGUgdG9nZ2xpbmcuXG4gICAgd2luZG93W1RvZ2dsZS5jYWxsYmFja11bdGhpcy5zZXR0aW5ncy5zZWxlY3Rvcl0gPSB0cnVlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ2xpY2sgZXZlbnQgaGFuZGxlclxuICAgKlxuICAgKiBAcGFyYW0gIHtFdmVudH0gIGV2ZW50ICBUaGUgb3JpZ2luYWwgY2xpY2sgZXZlbnRcbiAgICovXG4gIGNsaWNrKGV2ZW50KSB7XG4gICAgdGhpcy50b2dnbGUoZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIElucHV0L3NlbGVjdC90ZXh0YXJlYSBjaGFuZ2UgZXZlbnQgaGFuZGxlci4gQ2hlY2tzIHRvIHNlZSBpZiB0aGVcbiAgICogZXZlbnQudGFyZ2V0IGlzIHZhbGlkIHRoZW4gdG9nZ2xlcyBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQHBhcmFtICB7RXZlbnR9ICBldmVudCAgVGhlIG9yaWdpbmFsIGlucHV0IGNoYW5nZSBldmVudFxuICAgKi9cbiAgY2hhbmdlKGV2ZW50KSB7XG4gICAgbGV0IHZhbGlkID0gZXZlbnQudGFyZ2V0LmNoZWNrVmFsaWRpdHkoKTtcblxuICAgIGlmICh2YWxpZCAmJiAhdGhpcy5pc0FjdGl2ZShldmVudC50YXJnZXQpKSB7XG4gICAgICB0aGlzLnRvZ2dsZShldmVudCk7IC8vIHNob3dcbiAgICB9IGVsc2UgaWYgKCF2YWxpZCAmJiB0aGlzLmlzQWN0aXZlKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgIHRoaXMudG9nZ2xlKGV2ZW50KTsgLy8gaGlkZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB0byBzZWUgaWYgdGhlIHRvZ2dsZSBpcyBhY3RpdmVcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgZWxlbWVudCAgVGhlIHRvZ2dsZSBlbGVtZW50ICh0cmlnZ2VyKVxuICAgKi9cbiAgaXNBY3RpdmUoZWxlbWVudCkge1xuICAgIGxldCBhY3RpdmUgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKSB7XG4gICAgICBhY3RpdmUgPSBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKVxuICAgIH1cblxuICAgIC8vIGlmICgpIHtcbiAgICAgIC8vIFRvZ2dsZS5lbGVtZW50QXJpYVJvbGVzXG4gICAgICAvLyBUT0RPOiBBZGQgY2F0Y2ggdG8gc2VlIGlmIGVsZW1lbnQgYXJpYSByb2xlcyBhcmUgdG9nZ2xlZFxuICAgIC8vIH1cblxuICAgIC8vIGlmICgpIHtcbiAgICAgIC8vIFRvZ2dsZS50YXJnZXRBcmlhUm9sZXNcbiAgICAgIC8vIFRPRE86IEFkZCBjYXRjaCB0byBzZWUgaWYgdGFyZ2V0IGFyaWEgcm9sZXMgYXJlIHRvZ2dsZWRcbiAgICAvLyB9XG5cbiAgICByZXR1cm4gYWN0aXZlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgdGFyZ2V0IG9mIHRoZSB0b2dnbGUgZWxlbWVudCAodHJpZ2dlcilcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgZWwgIFRoZSB0b2dnbGUgZWxlbWVudCAodHJpZ2dlcilcbiAgICovXG4gIGdldFRhcmdldChlbGVtZW50KSB7XG4gICAgbGV0IHRhcmdldCA9IGZhbHNlO1xuXG4gICAgLyoqIEFuY2hvciBMaW5rcyAqL1xuICAgIHRhcmdldCA9IChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnaHJlZicpKSA/XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJykpIDogdGFyZ2V0O1xuXG4gICAgLyoqIFRvZ2dsZSBDb250cm9scyAqL1xuICAgIHRhcmdldCA9IChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpKSA/XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpfWApIDogdGFyZ2V0O1xuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdG9nZ2xlIGV2ZW50IHByb3h5IGZvciBnZXR0aW5nIGFuZCBzZXR0aW5nIHRoZSBlbGVtZW50L3MgYW5kIHRhcmdldFxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBldmVudCAgVGhlIG1haW4gY2xpY2sgZXZlbnRcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgIFRoZSBUb2dnbGUgaW5zdGFuY2VcbiAgICovXG4gIHRvZ2dsZShldmVudCkge1xuICAgIGxldCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuICAgIGxldCB0YXJnZXQgPSBmYWxzZTtcbiAgICBsZXQgZm9jdXNhYmxlID0gW107XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGFyZ2V0ID0gdGhpcy5nZXRUYXJnZXQoZWxlbWVudCk7XG5cbiAgICAvKiogRm9jdXNhYmxlIENoaWxkcmVuICovXG4gICAgZm9jdXNhYmxlID0gKHRhcmdldCkgP1xuICAgICAgdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoVG9nZ2xlLmVsRm9jdXNhYmxlLmpvaW4oJywgJykpIDogZm9jdXNhYmxlO1xuXG4gICAgLyoqIE1haW4gRnVuY3Rpb25hbGl0eSAqL1xuICAgIGlmICghdGFyZ2V0KSByZXR1cm4gdGhpcztcbiAgICB0aGlzLmVsZW1lbnRUb2dnbGUoZWxlbWVudCwgdGFyZ2V0LCBmb2N1c2FibGUpO1xuXG4gICAgLyoqIFVuZG8gKi9cbiAgICBpZiAoZWxlbWVudC5kYXRhc2V0W2Ake3RoaXMuc2V0dGluZ3MubmFtZXNwYWNlfVVuZG9gXSkge1xuICAgICAgY29uc3QgdW5kbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGVsZW1lbnQuZGF0YXNldFtgJHt0aGlzLnNldHRpbmdzLm5hbWVzcGFjZX1VbmRvYF1cbiAgICAgICk7XG5cbiAgICAgIHVuZG8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5lbGVtZW50VG9nZ2xlKGVsZW1lbnQsIHRhcmdldCk7XG4gICAgICAgIHVuZG8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBvdGhlciB0b2dnbGVzIHRoYXQgbWlnaHQgY29udHJvbCB0aGUgc2FtZSBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSAgIHtPYmplY3R9ICAgIGVsZW1lbnQgIFRoZSB0b2dnbGluZyBlbGVtZW50XG4gICAqXG4gICAqIEByZXR1cm4gIHtOb2RlTGlzdH0gICAgICAgICAgIExpc3Qgb2Ygb3RoZXIgdG9nZ2xpbmcgZWxlbWVudHNcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdCBjb250cm9sIHRoZSB0YXJnZXRcbiAgICovXG4gIGdldE90aGVycyhlbGVtZW50KSB7XG4gICAgbGV0IHNlbGVjdG9yID0gZmFsc2U7XG5cbiAgICBpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2hyZWYnKSkge1xuICAgICAgc2VsZWN0b3IgPSBgW2hyZWY9XCIke2VsZW1lbnQuZ2V0QXR0cmlidXRlKCdocmVmJyl9XCJdYDtcbiAgICB9IGVsc2UgaWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJykpIHtcbiAgICAgIHNlbGVjdG9yID0gYFthcmlhLWNvbnRyb2xzPVwiJHtlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpfVwiXWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIChzZWxlY3RvcikgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSA6IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgdGhlIFRvZ2dsZSBUYXJnZXQncyBmb2N1c2FibGUgY2hpbGRyZW4gZnJvbSBmb2N1cy5cbiAgICogSWYgYW4gZWxlbWVudCBoYXMgdGhlIGRhdGEtYXR0cmlidXRlIGBkYXRhLXRvZ2dsZS10YWJpbmRleGBcbiAgICogaXQgd2lsbCB1c2UgdGhhdCBhcyB0aGUgZGVmYXVsdCB0YWIgaW5kZXggb2YgdGhlIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSAgIHtOb2RlTGlzdH0gIGVsZW1lbnRzICBMaXN0IG9mIGZvY3VzYWJsZSBlbGVtZW50c1xuICAgKlxuICAgKiBAcmV0dXJuICB7T2JqZWN0fSAgICAgICAgICAgICAgVGhlIFRvZ2dsZSBJbnN0YW5jZVxuICAgKi9cbiAgdG9nZ2xlRm9jdXNhYmxlKGVsZW1lbnRzKSB7XG4gICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgIGxldCB0YWJpbmRleCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpO1xuXG4gICAgICBpZiAodGFiaW5kZXggPT09ICctMScpIHtcbiAgICAgICAgbGV0IGRhdGFEZWZhdWx0ID0gZWxlbWVudFxuICAgICAgICAgIC5nZXRBdHRyaWJ1dGUoYGRhdGEtJHtUb2dnbGUubmFtZXNwYWNlfS10YWJpbmRleGApO1xuXG4gICAgICAgIGlmIChkYXRhRGVmYXVsdCkge1xuICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIGRhdGFEZWZhdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBKdW1wcyB0byBFbGVtZW50IHZpc2libHkgYW5kIHNoaWZ0cyBmb2N1c1xuICAgKiB0byB0aGUgZWxlbWVudCBieSBzZXR0aW5nIHRoZSB0YWJpbmRleFxuICAgKlxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgZWxlbWVudCAgVGhlIFRvZ2dsaW5nIEVsZW1lbnRcbiAgICogQHBhcmFtICAge09iamVjdH0gIHRhcmdldCAgIFRoZSBUYXJnZXQgRWxlbWVudFxuICAgKlxuICAgKiBAcmV0dXJuICB7T2JqZWN0fSAgICAgICAgICAgVGhlIFRvZ2dsZSBpbnN0YW5jZVxuICAgKi9cbiAganVtcFRvKGVsZW1lbnQsIHRhcmdldCkge1xuICAgIC8vIFJlc2V0IHRoZSBoaXN0b3J5IHN0YXRlLiBUaGlzIHdpbGwgY2xlYXIgb3V0XG4gICAgLy8gdGhlIGhhc2ggd2hlbiB0aGUgdGFyZ2V0IGlzIHRvZ2dsZWQgY2xvc2VkXG4gICAgaGlzdG9yeS5wdXNoU3RhdGUoJycsICcnLFxuICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG5cbiAgICAvLyBGb2N1cyBpZiBhY3RpdmVcbiAgICBpZiAodGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKSkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuXG4gICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gICAgICB0YXJnZXQuZm9jdXMoe3ByZXZlbnRTY3JvbGw6IHRydWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbWFpbiB0b2dnbGluZyBtZXRob2QgZm9yIGF0dHJpYnV0ZXNcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgICBlbGVtZW50ICAgIFRoZSBUb2dnbGUgZWxlbWVudFxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAgIHRhcmdldCAgICAgVGhlIFRhcmdldCBlbGVtZW50IHRvIHRvZ2dsZSBhY3RpdmUvaGlkZGVuXG4gICAqIEBwYXJhbSAge05vZGVMaXN0fSAgZm9jdXNhYmxlICBBbnkgZm9jdXNhYmxlIGNoaWxkcmVuIGluIHRoZSB0YXJnZXRcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgIFRoZSBUb2dnbGUgaW5zdGFuY2VcbiAgICovXG4gIGVsZW1lbnRUb2dnbGUoZWxlbWVudCwgdGFyZ2V0LCBmb2N1c2FibGUgPSBbXSkge1xuICAgIGxldCBpID0gMDtcbiAgICBsZXQgYXR0ciA9ICcnO1xuICAgIGxldCB2YWx1ZSA9ICcnO1xuXG4gICAgLyoqXG4gICAgICogU3RvcmUgZWxlbWVudHMgZm9yIHBvdGVudGlhbCB1c2UgaW4gY2FsbGJhY2tzXG4gICAgICovXG5cbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIHRoaXMub3RoZXJzID0gdGhpcy5nZXRPdGhlcnMoZWxlbWVudCk7XG4gICAgdGhpcy5mb2N1c2FibGUgPSBmb2N1c2FibGU7XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGl0eSBtZXRob2QgcHJvcGVydHkgdGhhdCB3aWxsIGNhbmNlbCB0aGUgdG9nZ2xlIGlmIGl0IHJldHVybnMgZmFsc2VcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLnZhbGlkICYmICF0aGlzLnNldHRpbmdzLnZhbGlkKHRoaXMpKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGluZyBiZWZvcmUgaG9va1xuICAgICAqL1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYmVmb3JlKVxuICAgICAgdGhpcy5zZXR0aW5ncy5iZWZvcmUodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGUgRWxlbWVudCBhbmQgVGFyZ2V0IGNsYXNzZXNcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKTtcbiAgICAgIHRoaXMudGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUodGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzcyk7XG5cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBvdGhlciB0b2dnbGVzIHRoYXQgY29udHJvbCB0aGUgc2FtZSBlbGVtZW50XG4gICAgICB0aGlzLm90aGVycy5mb3JFYWNoKG90aGVyID0+IHtcbiAgICAgICAgaWYgKG90aGVyICE9PSB0aGlzLmVsZW1lbnQpXG4gICAgICAgICAgb3RoZXIuY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmluYWN0aXZlQ2xhc3MpXG4gICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSh0aGlzLnNldHRpbmdzLmluYWN0aXZlQ2xhc3MpO1xuXG4gICAgLyoqXG4gICAgICogVGFyZ2V0IEVsZW1lbnQgQXJpYSBBdHRyaWJ1dGVzXG4gICAgICovXG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgVG9nZ2xlLnRhcmdldEFyaWFSb2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0ciA9IFRvZ2dsZS50YXJnZXRBcmlhUm9sZXNbaV07XG4gICAgICB2YWx1ZSA9IHRoaXMudGFyZ2V0LmdldEF0dHJpYnV0ZShhdHRyKTtcblxuICAgICAgaWYgKHZhbHVlICE9ICcnICYmIHZhbHVlKVxuICAgICAgICB0aGlzLnRhcmdldC5zZXRBdHRyaWJ1dGUoYXR0ciwgKHZhbHVlID09PSAndHJ1ZScpID8gJ2ZhbHNlJyA6ICd0cnVlJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIHRoZSB0YXJnZXQncyBmb2N1c2FibGUgY2hpbGRyZW4gdGFiaW5kZXhcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmZvY3VzYWJsZSlcbiAgICAgIHRoaXMudG9nZ2xlRm9jdXNhYmxlKHRoaXMuZm9jdXNhYmxlKTtcblxuICAgIC8qKlxuICAgICAqIEp1bXAgdG8gVGFyZ2V0IEVsZW1lbnQgaWYgVG9nZ2xlIEVsZW1lbnQgaXMgYW4gYW5jaG9yIGxpbmtcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmp1bXAgJiYgdGhpcy5lbGVtZW50Lmhhc0F0dHJpYnV0ZSgnaHJlZicpKVxuICAgICAgdGhpcy5qdW1wVG8odGhpcy5lbGVtZW50LCB0aGlzLnRhcmdldCk7XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGUgRWxlbWVudCAoaW5jbHVkaW5nIG11bHRpIHRvZ2dsZXMpIEFyaWEgQXR0cmlidXRlc1xuICAgICAqL1xuXG4gICAgZm9yIChpID0gMDsgaSA8IFRvZ2dsZS5lbEFyaWFSb2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0ciA9IFRvZ2dsZS5lbEFyaWFSb2xlc1tpXTtcbiAgICAgIHZhbHVlID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyKTtcblxuICAgICAgaWYgKHZhbHVlICE9ICcnICYmIHZhbHVlKVxuICAgICAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsICh2YWx1ZSA9PT0gJ3RydWUnKSA/ICdmYWxzZScgOiAndHJ1ZScpO1xuXG4gICAgICAvLyBJZiB0aGVyZSBhcmUgb3RoZXIgdG9nZ2xlcyB0aGF0IGNvbnRyb2wgdGhlIHNhbWUgZWxlbWVudFxuICAgICAgdGhpcy5vdGhlcnMuZm9yRWFjaCgob3RoZXIpID0+IHtcbiAgICAgICAgaWYgKG90aGVyICE9PSB0aGlzLmVsZW1lbnQgJiYgb3RoZXIuZ2V0QXR0cmlidXRlKGF0dHIpKVxuICAgICAgICAgIG90aGVyLnNldEF0dHJpYnV0ZShhdHRyLCAodmFsdWUgPT09ICd0cnVlJykgPyAnZmFsc2UnIDogJ3RydWUnKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRvZ2dsaW5nIGNvbXBsZXRlIGhvb2tcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmFmdGVyKVxuICAgICAgdGhpcy5zZXR0aW5ncy5hZnRlcih0aGlzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG5cbi8qKiBAdHlwZSAge1N0cmluZ30gIFRoZSBtYWluIHNlbGVjdG9yIHRvIGFkZCB0aGUgdG9nZ2xpbmcgZnVuY3Rpb24gdG8gKi9cblRvZ2dsZS5zZWxlY3RvciA9ICdbZGF0YS1qcyo9XCJ0b2dnbGVcIl0nO1xuXG4vKiogQHR5cGUgIHtTdHJpbmd9ICBUaGUgbmFtZXNwYWNlIGZvciBvdXIgZGF0YSBhdHRyaWJ1dGUgc2V0dGluZ3MgKi9cblRvZ2dsZS5uYW1lc3BhY2UgPSAndG9nZ2xlJztcblxuLyoqIEB0eXBlICB7U3RyaW5nfSAgVGhlIGhpZGUgY2xhc3MgKi9cblRvZ2dsZS5pbmFjdGl2ZUNsYXNzID0gJ2hpZGRlbic7XG5cbi8qKiBAdHlwZSAge1N0cmluZ30gIFRoZSBhY3RpdmUgY2xhc3MgKi9cblRvZ2dsZS5hY3RpdmVDbGFzcyA9ICdhY3RpdmUnO1xuXG4vKiogQHR5cGUgIHtBcnJheX0gIEFyaWEgcm9sZXMgdG8gdG9nZ2xlIHRydWUvZmFsc2Ugb24gdGhlIHRvZ2dsaW5nIGVsZW1lbnQgKi9cblRvZ2dsZS5lbEFyaWFSb2xlcyA9IFsnYXJpYS1wcmVzc2VkJywgJ2FyaWEtZXhwYW5kZWQnXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBBcmlhIHJvbGVzIHRvIHRvZ2dsZSB0cnVlL2ZhbHNlIG9uIHRoZSB0YXJnZXQgZWxlbWVudCAqL1xuVG9nZ2xlLnRhcmdldEFyaWFSb2xlcyA9IFsnYXJpYS1oaWRkZW4nXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBGb2N1c2FibGUgZWxlbWVudHMgdG8gaGlkZSB3aXRoaW4gdGhlIGhpZGRlbiB0YXJnZXQgZWxlbWVudCAqL1xuVG9nZ2xlLmVsRm9jdXNhYmxlID0gW1xuICAnYScsICdidXR0b24nLCAnaW5wdXQnLCAnc2VsZWN0JywgJ3RleHRhcmVhJywgJ29iamVjdCcsICdlbWJlZCcsICdmb3JtJyxcbiAgJ2ZpZWxkc2V0JywgJ2xlZ2VuZCcsICdsYWJlbCcsICdhcmVhJywgJ2F1ZGlvJywgJ3ZpZGVvJywgJ2lmcmFtZScsICdzdmcnLFxuICAnZGV0YWlscycsICd0YWJsZScsICdbdGFiaW5kZXhdJywgJ1tjb250ZW50ZWRpdGFibGVdJywgJ1t1c2VtYXBdJ1xuXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBLZXkgYXR0cmlidXRlIGZvciBzdG9yaW5nIHRvZ2dsZXMgaW4gdGhlIHdpbmRvdyAqL1xuVG9nZ2xlLmNhbGxiYWNrID0gWydUb2dnbGVzQ2FsbGJhY2snXTtcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBEZWZhdWx0IGV2ZW50cyB0byB0byB3YXRjaCBmb3IgdG9nZ2xpbmcuIEVhY2ggbXVzdCBoYXZlIGEgaGFuZGxlciBpbiB0aGUgY2xhc3MgYW5kIGVsZW1lbnRzIHRvIGxvb2sgZm9yIGluIFRvZ2dsZS5lbGVtZW50cyAqL1xuVG9nZ2xlLmV2ZW50cyA9IFsnY2xpY2snLCAnY2hhbmdlJ107XG5cbi8qKiBAdHlwZSAge0FycmF5fSAgRWxlbWVudHMgdG8gZGVsZWdhdGUgdG8gZWFjaCBldmVudCBoYW5kbGVyICovXG5Ub2dnbGUuZWxlbWVudHMgPSB7XG4gIENMSUNLOiBbJ0EnLCAnQlVUVE9OJ10sXG4gIENIQU5HRTogWydTRUxFQ1QnLCAnSU5QVVQnLCAnVEVYVEFSRUEnXVxufTtcblxuZXhwb3J0IGRlZmF1bHQgVG9nZ2xlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFRoZSBJY29uIG1vZHVsZVxuICogQGNsYXNzXG4gKi9cbmNsYXNzIEljb25zIHtcbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIGljb24gZmlsZVxuICAgKiBAcmV0dXJuIHtvYmplY3R9IFRoZSBjbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3IocGF0aCkge1xuICAgIHBhdGggPSAocGF0aCkgPyBwYXRoIDogSWNvbnMucGF0aDtcblxuICAgIGZldGNoKHBhdGgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLm9rKVxuICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKVxuICAgICAgICAgICAgY29uc29sZS5kaXIocmVzcG9uc2UpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpXG4gICAgICAgICAgY29uc29sZS5kaXIoZXJyb3IpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwcml0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBzcHJpdGUuaW5uZXJIVE1MID0gZGF0YTtcbiAgICAgICAgc3ByaXRlLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgc3ByaXRlLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTogbm9uZTsnKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzcHJpdGUpO1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vKiogQHR5cGUge1N0cmluZ30gVGhlIHBhdGggb2YgdGhlIGljb24gZmlsZSAqL1xuSWNvbnMucGF0aCA9ICdzdmcvaWNvbnMuc3ZnJztcblxuZXhwb3J0IGRlZmF1bHQgSWNvbnM7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU3RhdGljIGNvbHVtbiBtb2R1bGVcbiAqIFNpbWlsYXIgdG8gdGhlIGdlbmVyYWwgc3RpY2t5IG1vZHVsZSBidXQgdXNlZCBzcGVjaWZpY2FsbHkgd2hlbiBvbmUgY29sdW1uXG4gKiBvZiBhIHR3by1jb2x1bW4gbGF5b3V0IGlzIG1lYW50IHRvIGJlIHN0aWNreVxuICogQG1vZHVsZSBtb2R1bGVzL3N0YXRpY0NvbHVtblxuICogQHNlZSBtb2R1bGVzL3N0aWNreU5hdlxuICovXG5cbmNsYXNzIFN0YXRpY0NvbHVtbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3NldHRpbmdzID0ge1xuICAgICAgc2VsZWN0b3I6IFN0YXRpY0NvbHVtbi5zZWxlY3RvcixcbiAgICB9O1xuXG4gICAgY29uc3Qgc3RpY2t5Q29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICBgLiR7dGhpcy5fc2V0dGluZ3Muc2VsZWN0b3J9YFxuICAgICk7XG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgd2luZG93IHBvc2l0aW9uIGFuZCBzZXRzIHRoZSBhcHByb3ByaWF0ZSBjbGFzcyBvbiB0aGUgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdGlja3lDb250ZW50RWxlbSAtIERPTSBub2RlIHRoYXQgc2hvdWxkIGJlIHN0aWNraWVkXG4gICAgICovXG4gICAgdGhpcy5hc3NpZ25TdGlja3lGZWF0dXJlKHN0aWNreUNvbnRlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBlbGVtZXRzIGNvbnRhaW5pbmcgdGhlIGNsYXNzICdqcy1zdGF0aWMnLlxuICAgKiBPbiBwYWdlIGxvYWQsIHNjcmVlblJlc2l6ZSBhbmQgc2Nyb2xsIGV2ZW50cywgY2FsbHMgU3RhdGljQ29sdW1uLmNhbGNXaW5kb3dQb3MgZnVuY3Rpb24gLlxuICAgKiBAcGFyYW0ge2VsZW1lbnRzfSBzdGlja3lDb250ZW50IEVsZW1lbnQgaW4gY2hpY2ggdGhlIHN0aWNreSBlZmZlY3Qgd2lsbCBiZSBhcHBsaWVkXG4gICAqL1xuXG4gIGFzc2lnblN0aWNreUZlYXR1cmUoc3RpY2t5Q29udGVudCkge1xuICAgIGlmIChzdGlja3lDb250ZW50KSB7XG4gICAgICBzdGlja3lDb250ZW50LmZvckVhY2goZnVuY3Rpb24oc3RpY2t5Q29udGVudEVsZW0pIHtcbiAgICAgICAgU3RhdGljQ29sdW1uLmNhbGNXaW5kb3dQb3Moc3RpY2t5Q29udGVudEVsZW0pO1xuICAgICAgICAvKipcbiAgICAgICAgICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciAnc2Nyb2xsJy5cbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgICAgICovXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICdzY3JvbGwnLFxuICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgU3RhdGljQ29sdW1uLmNhbGNXaW5kb3dQb3Moc3RpY2t5Q29udGVudEVsZW0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFsc2VcbiAgICAgICAgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciAncmVzaXplJy5cbiAgICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIFRoZSBldmVudCBvYmplY3RcbiAgICAgICAgICovXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICdyZXNpemUnLFxuICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgU3RhdGljQ29sdW1uLmNhbGNXaW5kb3dQb3Moc3RpY2t5Q29udGVudEVsZW0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFsc2VcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIGRlcGVuZGluZyBvbiBlbGVtZW50cyBwb3N0aW9uIGluIHRoZSBwYWdlIGFkZCBhbmQgcmVtb3ZlIGNsYXNzZXNcbiAqIEBwYXJhbSB7ZWxlbWVudH0gc3RpY2t5Q29udGVudEVsZW0gYW4gZWxlbWVudCB3aXRoIHRoZSBjbGFzcyBuYW1lICdqcy1zdGF0aWMnXG4gKi9cblxuU3RhdGljQ29sdW1uLmNhbGNXaW5kb3dQb3MgPSBmdW5jdGlvbihzdGlja3lDb250ZW50RWxlbSkge1xuICBsZXQgZWxlbVRvcCA9IHN0aWNreUNvbnRlbnRFbGVtLnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICBsZXQgaXNQYXN0Qm90dG9tID1cbiAgICB3aW5kb3cuaW5uZXJIZWlnaHQgLVxuICAgICAgc3RpY2t5Q29udGVudEVsZW0ucGFyZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLVxuICAgICAgc3RpY2t5Q29udGVudEVsZW0ucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgPlxuICAgIDA7XG5cbiAgLy8gU2V0cyBlbGVtZW50IHRvIHBvc2l0aW9uIGFic29sdXRlIGlmIG5vdCBzY3JvbGxlZCB0byB5ZXQuXG4gIC8vIEFic29sdXRlbHkgcG9zaXRpb25pbmcgb25seSB3aGVuIG5lY2Vzc2FyeSBhbmQgbm90IGJ5IGRlZmF1bHQgcHJldmVudHMgZmxpY2tlcmluZ1xuICAvLyB3aGVuIHJlbW92aW5nIHRoZSBcImlzLWJvdHRvbVwiIGNsYXNzIG9uIENocm9tZVxuICBpZiAoZWxlbVRvcCA+IDApIHtcbiAgICBzdGlja3lDb250ZW50RWxlbS5jbGFzc0xpc3QuYWRkKFN0YXRpY0NvbHVtbi5ub3RTdGlja3lDbGFzcyk7XG4gIH0gZWxzZSB7XG4gICAgc3RpY2t5Q29udGVudEVsZW0uY2xhc3NMaXN0LnJlbW92ZShTdGF0aWNDb2x1bW4ubm90U3RpY2t5Q2xhc3MpO1xuICB9XG4gIGlmIChpc1Bhc3RCb3R0b20pIHtcbiAgICBzdGlja3lDb250ZW50RWxlbS5jbGFzc0xpc3QuYWRkKFN0YXRpY0NvbHVtbi5ib3R0b21DbGFzcyk7XG4gIH0gZWxzZSB7XG4gICAgc3RpY2t5Q29udGVudEVsZW0uY2xhc3NMaXN0LnJlbW92ZShTdGF0aWNDb2x1bW4uYm90dG9tQ2xhc3MpO1xuICB9XG59O1xuXG5TdGF0aWNDb2x1bW4uc2VsZWN0b3IgPSAnanMtc3RhdGljJztcblN0YXRpY0NvbHVtbi5ub3RTdGlja3lDbGFzcyA9ICdpcy1ub3Qtc3RpY2t5JztcblN0YXRpY0NvbHVtbi5ib3R0b21DbGFzcyA9ICdpcy1ib3R0b20nO1xuXG5leHBvcnQgZGVmYXVsdCBTdGF0aWNDb2x1bW47XG4iLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIEFuaW1hdGlvbnMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHtcbiAgICAgIHNlbGVjdG9yOiBBbmltYXRpb25zLnNlbGVjdG9yLFxuICAgICAgY29udHJvbGxlcjogQW5pbWF0aW9ucy5jb250cm9sbGVyLFxuICAgICAgc3BlZWQ6IEFuaW1hdGlvbnMuc3BlZWQsXG4gICAgfTtcblxuICAgIGNvbnN0IHJvdGF0aW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLl9zZXR0aW5ncy5zZWxlY3Rvcik7XG4gICAgdmFyIHRlcm1zID0gW107XG5cbiAgICAvLyBJdGVyYXRlIG92ZXIgdGhlIGVsZW1lbnQgYW5kIGFkZCB0aGVpciB0ZXh0Q29udGVudCBpbiBhbiBhcnJheVxuICAgIHJvdGF0aW5nLmZvckVhY2goZnVuY3Rpb24odGVybSkge1xuICAgICAgaWYgKHRlcm0uaW5uZXJUZXh0LnRyaW0oKSAhPT0gJycpIHtcbiAgICAgICAgdGVybXMucHVzaCh0ZXJtLmlubmVyVGV4dCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBBbmltYXRpb25zLnJvdGF0ZVRlcm1zKFxuICAgICAgdGVybXMsXG4gICAgICB0aGlzLl9zZXR0aW5ncy5jb250cm9sbGVyLFxuICAgICAgdGhpcy5fc2V0dGluZ3Muc3BlZWRcbiAgICApO1xuICB9XG59XG5cbi8qKlxuICogQWNjZXB0cyBhcnJheSBvZiBzdHJpbmcgYW5kIGNyZWF0ZXMgcm90YXRpbmcgbG9vcCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZSB0aW1lIHByb3ZpZGVkIGFzIGEgc3BlZWQgYXJndW1lbnQuXG4gKiBBZnRlciBldmVyeSByb3RhdGlvbiBjYWxsZXMgdGhlIEFuaW1hdGlvbi5mYWRlSW5vdXQgZnVuY3Rpb25cbiAqIEBwYXJhbSB7YXJyYXl9IHRlcm1zIGFycmF5IG9mIHN0cmluZ3NcbiAqIEBwYXJhbSB7ZGF0YS1qc30gY29udHJvbCB0aGUgYW5pbWF0aW9uIGNvbnRyb2xsaW5nIGVsZW1lbnQgY2xhc3NcbiAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZCBhbmltYXRpb24gc3BlZWVkXG4gKi9cblxuQW5pbWF0aW9ucy5yb3RhdGVUZXJtcyA9IGZ1bmN0aW9uKHRlcm1zLCBjb250cm9sLCBzcGVlZCkge1xuICBjb25zdCBjb250cm9sbGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250cm9sKTtcblxuICBjb250cm9sbGVyLmlubmVyVGV4dCA9IHRlcm1zWzBdLnRyaW0oKTtcbiAgQW5pbWF0aW9ucy5mYWRlSW5PdXQoY29udHJvbGxlcik7XG5cbiAgdmFyIGkgPSAxO1xuICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICBpZiAoaSA9PSB0ZXJtcy5sZW5ndGgpIHtcbiAgICAgIGkgPSAwO1xuICAgIH1cbiAgICBjb250cm9sbGVyLmlubmVyVGV4dCA9IHRlcm1zW2ldLnRyaW0oKTtcbiAgICBBbmltYXRpb25zLmZhZGVJbk91dChjb250cm9sbGVyKTtcblxuICAgIGkrKztcbiAgfSwgMzAwMCk7XG59O1xuXG4vKipcbiAqIEFmdGVyIGV2ZXkgcm90YXRpb24gYWRkcyBhbmQgcmVtb3ZlcyBhbmltYXRlLmNzcyBjbGFzc2VzIHRvIGZhZGUgaW4gYW5kIGZhZGUgb3V0IHRoZSBzdHJpbmdzXG4gKiBAcGFyYW0ge2VsZW1lbnR9IGNvbnRyb2xsZXJcbiAqL1xuQW5pbWF0aW9ucy5mYWRlSW5PdXQgPSBmdW5jdGlvbihjb250cm9sbGVyKSB7XG4gIGNvbnRyb2xsZXIuY2xhc3NMaXN0LmFkZCgnZmFkZUluJyk7XG5cbiAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICBjb250cm9sbGVyLmNsYXNzTGlzdC5hZGQoJ2ZhZGVPdXQnKTtcbiAgICBjb250cm9sbGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGVJbicpO1xuICB9LCAyMDAwKTtcbn07XG5cbkFuaW1hdGlvbnMuc3BlZWQgPSAxNTAwO1xuXG5BbmltYXRpb25zLnNlbGVjdG9yID0gJ1tkYXRhLWpzKj1cInJvdGF0ZS10ZXh0XCJdJztcblxuQW5pbWF0aW9ucy5jb250cm9sbGVyID0gJ1tkYXRhLWpzKj1cInJvdGF0ZS1jb250cm9sbGVyXCJdJztcblxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0aW9ucztcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IFRvZ2dsZSBmcm9tICdAbnljb3Bwb3J0dW5pdHkvcHR0cm4tc2NyaXB0cy9zcmMvdG9nZ2xlL3RvZ2dsZSc7XG5pbXBvcnQgSWNvbnMgZnJvbSAnQG55Y29wcG9ydHVuaXR5L3B0dHJuLXNjcmlwdHMvc3JjL2ljb25zL2ljb25zJztcbmltcG9ydCBTdGF0aWNDb2x1bW4gZnJvbSAnLi9zdGF0aWNDb2x1bW4nO1xuaW1wb3J0IFRleHRSb3RhdGlvbiBmcm9tICcuL3RleHRSb3RhdGlvbic7XG5cbmNsYXNzIERlZmF1bHQge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgdG9nZ2xlKCkge1xuICAgIHJldHVybiBuZXcgVG9nZ2xlKCk7XG4gIH1cblxuICBhY2NvcmRpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBUb2dnbGUoe1xuICAgICAgc2VsZWN0b3I6ICdbZGF0YS1qcyo9XCJhY2NvcmRpb25cIl0nLFxuICAgICAgYWZ0ZXI6ICh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLmVsZW1lbnQucGFyZW50Tm9kZS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1leHBhbmRlZCcpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGljb25zKHBhdGgpIHtcbiAgICByZXR1cm4gbmV3IEljb25zKHBhdGgpO1xuICB9XG5cbiAgc3RhdGljQ29sdW1uKCkge1xuICAgIHJldHVybiBuZXcgU3RhdGljQ29sdW1uKCk7XG4gIH1cblxuICB0ZXh0Um90YXRpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBUZXh0Um90YXRpb24oKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0O1xuIl0sIm5hbWVzIjpbIlRleHRSb3RhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7O0VBRUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxNQUFNLENBQUM7RUFDYjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLEVBQUUsV0FBVyxDQUFDLENBQUMsRUFBRTtFQUNqQjtFQUNBLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztFQUMvQyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ25DO0VBQ0EsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCO0VBQ0EsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHO0VBQ3BCLE1BQU0sUUFBUSxF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T0FBTztFQUNsQyxVQUFVLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDNUQsT0FBTyxDQUFDLENBQUM7RUFDVCxLQUFLO0FBQ0w7RUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhO0VBQ25DLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzRDtFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0VBQ3hELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDdkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0M7RUFDQSxNQUFNLElBQUksS0FBSyxJQUFJLEVBQUUsSUFBSSxLQUFLO0VBQzlCLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxLQUFLLE1BQU0sSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7RUFDOUUsS0FBSztBQUNMO0VBQ0E7RUFDQTtFQUNBO0FBQ0E7RUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTO0VBQy9CLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0M7RUFDQTtFQUNBO0VBQ0E7QUFDQTtFQUNBLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7RUFDL0QsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FB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
