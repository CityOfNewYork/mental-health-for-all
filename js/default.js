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
        })
        .catch((error) => {
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

  return Default;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy90b2dnbGUvdG9nZ2xlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy9pY29ucy9pY29ucy5qcyIsIi4uLy4uL3NyYy9qcy9kZWZhdWx0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBUaGUgU2ltcGxlIFRvZ2dsZSBjbGFzcy4gVGhpcyB3aWxsIHRvZ2dsZSB0aGUgY2xhc3MgJ2FjdGl2ZScgYW5kICdoaWRkZW4nXG4gKiBvbiB0YXJnZXQgZWxlbWVudHMsIGRldGVybWluZWQgYnkgYSBjbGljayBldmVudCBvbiBhIHNlbGVjdGVkIGxpbmsgb3JcbiAqIGVsZW1lbnQuIFRoaXMgd2lsbCBhbHNvIHRvZ2dsZSB0aGUgYXJpYS1oaWRkZW4gYXR0cmlidXRlIGZvciB0YXJnZXRlZFxuICogZWxlbWVudHMgdG8gc3VwcG9ydCBzY3JlZW4gcmVhZGVycy4gVGFyZ2V0IHNldHRpbmdzIGFuZCBvdGhlciBmdW5jdGlvbmFsaXR5XG4gKiBjYW4gYmUgY29udHJvbGxlZCB0aHJvdWdoIGRhdGEgYXR0cmlidXRlcy5cbiAqXG4gKiBUaGlzIHVzZXMgdGhlIC5tYXRjaGVzKCkgbWV0aG9kIHdoaWNoIHdpbGwgcmVxdWlyZSBhIHBvbHlmaWxsIGZvciBJRVxuICogaHR0cHM6Ly9wb2x5ZmlsbC5pby92Mi9kb2NzL2ZlYXR1cmVzLyNFbGVtZW50X3Byb3RvdHlwZV9tYXRjaGVzXG4gKlxuICogQGNsYXNzXG4gKi9cbmNsYXNzIFRvZ2dsZSB7XG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgcyAgU2V0dGluZ3MgZm9yIHRoaXMgVG9nZ2xlIGluc3RhbmNlXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgIFRoZSBjbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3Iocykge1xuICAgIC8vIENyZWF0ZSBhbiBvYmplY3QgdG8gc3RvcmUgZXhpc3RpbmcgdG9nZ2xlIGxpc3RlbmVycyAoaWYgaXQgZG9lc24ndCBleGlzdClcbiAgICBpZiAoIXdpbmRvdy5oYXNPd25Qcm9wZXJ0eShUb2dnbGUuY2FsbGJhY2spKVxuICAgICAgd2luZG93W1RvZ2dsZS5jYWxsYmFja10gPSBbXTtcblxuICAgIHMgPSAoIXMpID8ge30gOiBzO1xuXG4gICAgdGhpcy5zZXR0aW5ncyA9IHtcbiAgICAgIHNlbGVjdG9yOiAocy5zZWxlY3RvcikgPyBzLnNlbGVjdG9yIDogVG9nZ2xlLnNlbGVjdG9yLFxuICAgICAgbmFtZXNwYWNlOiAocy5uYW1lc3BhY2UpID8gcy5uYW1lc3BhY2UgOiBUb2dnbGUubmFtZXNwYWNlLFxuICAgICAgaW5hY3RpdmVDbGFzczogKHMuaW5hY3RpdmVDbGFzcykgPyBzLmluYWN0aXZlQ2xhc3MgOiBUb2dnbGUuaW5hY3RpdmVDbGFzcyxcbiAgICAgIGFjdGl2ZUNsYXNzOiAocy5hY3RpdmVDbGFzcykgPyBzLmFjdGl2ZUNsYXNzIDogVG9nZ2xlLmFjdGl2ZUNsYXNzLFxuICAgICAgYmVmb3JlOiAocy5iZWZvcmUpID8gcy5iZWZvcmUgOiBmYWxzZSxcbiAgICAgIGFmdGVyOiAocy5hZnRlcikgPyBzLmFmdGVyIDogZmFsc2UsXG4gICAgICB2YWxpZDogKHMudmFsaWQpID8gcy52YWxpZCA6IGZhbHNlLFxuICAgICAgZm9jdXNhYmxlOiAocy5oYXNPd25Qcm9wZXJ0eSgnZm9jdXNhYmxlJykpID8gcy5mb2N1c2FibGUgOiB0cnVlLFxuICAgICAganVtcDogKHMuaGFzT3duUHJvcGVydHkoJ2p1bXAnKSkgPyBzLmp1bXAgOiB0cnVlXG4gICAgfTtcblxuICAgIC8vIFN0b3JlIHRoZSBlbGVtZW50IGZvciBwb3RlbnRpYWwgdXNlIGluIGNhbGxiYWNrc1xuICAgIHRoaXMuZWxlbWVudCA9IChzLmVsZW1lbnQpID8gcy5lbGVtZW50IDogZmFsc2U7XG5cbiAgICBpZiAodGhpcy5lbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy50b2dnbGUoZXZlbnQpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRoZXJlIGlzbid0IGFuIGV4aXN0aW5nIGluc3RhbnRpYXRlZCB0b2dnbGUsIGFkZCB0aGUgZXZlbnQgbGlzdGVuZXIuXG4gICAgICBpZiAoIXdpbmRvd1tUb2dnbGUuY2FsbGJhY2tdLmhhc093blByb3BlcnR5KHRoaXMuc2V0dGluZ3Muc2VsZWN0b3IpKSB7XG4gICAgICAgIGxldCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgVG9nZ2xlLmV2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGxldCB0Z2dsZUV2ZW50ID0gVG9nZ2xlLmV2ZW50c1tpXTtcblxuICAgICAgICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcih0Z2dsZUV2ZW50LCBldmVudCA9PiB7XG4gICAgICAgICAgICBpZiAoIWV2ZW50LnRhcmdldC5tYXRjaGVzKHRoaXMuc2V0dGluZ3Muc2VsZWN0b3IpKVxuICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuZXZlbnQgPSBldmVudDtcblxuICAgICAgICAgICAgbGV0IHR5cGUgPSBldmVudC50eXBlLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgdGhpc1tldmVudC50eXBlXSAmJlxuICAgICAgICAgICAgICBUb2dnbGUuZWxlbWVudHNbdHlwZV0gJiZcbiAgICAgICAgICAgICAgVG9nZ2xlLmVsZW1lbnRzW3R5cGVdLmluY2x1ZGVzKGV2ZW50LnRhcmdldC50YWdOYW1lKVxuICAgICAgICAgICAgKSB0aGlzW2V2ZW50LnR5cGVdKGV2ZW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlY29yZCB0aGF0IGEgdG9nZ2xlIHVzaW5nIHRoaXMgc2VsZWN0b3IgaGFzIGJlZW4gaW5zdGFudGlhdGVkLlxuICAgIC8vIFRoaXMgcHJldmVudHMgZG91YmxlIHRvZ2dsaW5nLlxuICAgIHdpbmRvd1tUb2dnbGUuY2FsbGJhY2tdW3RoaXMuc2V0dGluZ3Muc2VsZWN0b3JdID0gdHJ1ZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENsaWNrIGV2ZW50IGhhbmRsZXJcbiAgICpcbiAgICogQHBhcmFtICB7RXZlbnR9ICBldmVudCAgVGhlIG9yaWdpbmFsIGNsaWNrIGV2ZW50XG4gICAqL1xuICBjbGljayhldmVudCkge1xuICAgIHRoaXMudG9nZ2xlKGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnB1dC9zZWxlY3QvdGV4dGFyZWEgY2hhbmdlIGV2ZW50IGhhbmRsZXIuIENoZWNrcyB0byBzZWUgaWYgdGhlXG4gICAqIGV2ZW50LnRhcmdldCBpcyB2YWxpZCB0aGVuIHRvZ2dsZXMgYWNjb3JkaW5nbHkuXG4gICAqXG4gICAqIEBwYXJhbSAge0V2ZW50fSAgZXZlbnQgIFRoZSBvcmlnaW5hbCBpbnB1dCBjaGFuZ2UgZXZlbnRcbiAgICovXG4gIGNoYW5nZShldmVudCkge1xuICAgIGxldCB2YWxpZCA9IGV2ZW50LnRhcmdldC5jaGVja1ZhbGlkaXR5KCk7XG5cbiAgICBpZiAodmFsaWQgJiYgIXRoaXMuaXNBY3RpdmUoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgdGhpcy50b2dnbGUoZXZlbnQpOyAvLyBzaG93XG4gICAgfSBlbHNlIGlmICghdmFsaWQgJiYgdGhpcy5pc0FjdGl2ZShldmVudC50YXJnZXQpKSB7XG4gICAgICB0aGlzLnRvZ2dsZShldmVudCk7IC8vIGhpZGVcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgdG8gc2VlIGlmIHRoZSB0b2dnbGUgaXMgYWN0aXZlXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gIGVsZW1lbnQgIFRoZSB0b2dnbGUgZWxlbWVudCAodHJpZ2dlcilcbiAgICovXG4gIGlzQWN0aXZlKGVsZW1lbnQpIHtcbiAgICBsZXQgYWN0aXZlID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzcykge1xuICAgICAgYWN0aXZlID0gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzcylcbiAgICB9XG5cbiAgICAvLyBpZiAoKSB7XG4gICAgICAvLyBUb2dnbGUuZWxlbWVudEFyaWFSb2xlc1xuICAgICAgLy8gVE9ETzogQWRkIGNhdGNoIHRvIHNlZSBpZiBlbGVtZW50IGFyaWEgcm9sZXMgYXJlIHRvZ2dsZWRcbiAgICAvLyB9XG5cbiAgICAvLyBpZiAoKSB7XG4gICAgICAvLyBUb2dnbGUudGFyZ2V0QXJpYVJvbGVzXG4gICAgICAvLyBUT0RPOiBBZGQgY2F0Y2ggdG8gc2VlIGlmIHRhcmdldCBhcmlhIHJvbGVzIGFyZSB0b2dnbGVkXG4gICAgLy8gfVxuXG4gICAgcmV0dXJuIGFjdGl2ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHRhcmdldCBvZiB0aGUgdG9nZ2xlIGVsZW1lbnQgKHRyaWdnZXIpXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gIGVsICBUaGUgdG9nZ2xlIGVsZW1lbnQgKHRyaWdnZXIpXG4gICAqL1xuICBnZXRUYXJnZXQoZWxlbWVudCkge1xuICAgIGxldCB0YXJnZXQgPSBmYWxzZTtcblxuICAgIC8qKiBBbmNob3IgTGlua3MgKi9cbiAgICB0YXJnZXQgPSAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2hyZWYnKSkgP1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpKSA6IHRhcmdldDtcblxuICAgIC8qKiBUb2dnbGUgQ29udHJvbHMgKi9cbiAgICB0YXJnZXQgPSAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKSkgP1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgIyR7ZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKX1gKSA6IHRhcmdldDtcblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHRvZ2dsZSBldmVudCBwcm94eSBmb3IgZ2V0dGluZyBhbmQgc2V0dGluZyB0aGUgZWxlbWVudC9zIGFuZCB0YXJnZXRcbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgZXZlbnQgIFRoZSBtYWluIGNsaWNrIGV2ZW50XG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICBUaGUgVG9nZ2xlIGluc3RhbmNlXG4gICAqL1xuICB0b2dnbGUoZXZlbnQpIHtcbiAgICBsZXQgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcbiAgICBsZXQgdGFyZ2V0ID0gZmFsc2U7XG4gICAgbGV0IGZvY3VzYWJsZSA9IFtdO1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHRhcmdldCA9IHRoaXMuZ2V0VGFyZ2V0KGVsZW1lbnQpO1xuXG4gICAgLyoqIEZvY3VzYWJsZSBDaGlsZHJlbiAqL1xuICAgIGZvY3VzYWJsZSA9ICh0YXJnZXQpID9cbiAgICAgIHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKFRvZ2dsZS5lbEZvY3VzYWJsZS5qb2luKCcsICcpKSA6IGZvY3VzYWJsZTtcblxuICAgIC8qKiBNYWluIEZ1bmN0aW9uYWxpdHkgKi9cbiAgICBpZiAoIXRhcmdldCkgcmV0dXJuIHRoaXM7XG4gICAgdGhpcy5lbGVtZW50VG9nZ2xlKGVsZW1lbnQsIHRhcmdldCwgZm9jdXNhYmxlKTtcblxuICAgIC8qKiBVbmRvICovXG4gICAgaWYgKGVsZW1lbnQuZGF0YXNldFtgJHt0aGlzLnNldHRpbmdzLm5hbWVzcGFjZX1VbmRvYF0pIHtcbiAgICAgIGNvbnN0IHVuZG8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBlbGVtZW50LmRhdGFzZXRbYCR7dGhpcy5zZXR0aW5ncy5uYW1lc3BhY2V9VW5kb2BdXG4gICAgICApO1xuXG4gICAgICB1bmRvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuZWxlbWVudFRvZ2dsZShlbGVtZW50LCB0YXJnZXQpO1xuICAgICAgICB1bmRvLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgb3RoZXIgdG9nZ2xlcyB0aGF0IG1pZ2h0IGNvbnRyb2wgdGhlIHNhbWUgZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgICBlbGVtZW50ICBUaGUgdG9nZ2xpbmcgZWxlbWVudFxuICAgKlxuICAgKiBAcmV0dXJuICB7Tm9kZUxpc3R9ICAgICAgICAgICBMaXN0IG9mIG90aGVyIHRvZ2dsaW5nIGVsZW1lbnRzXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQgY29udHJvbCB0aGUgdGFyZ2V0XG4gICAqL1xuICBnZXRPdGhlcnMoZWxlbWVudCkge1xuICAgIGxldCBzZWxlY3RvciA9IGZhbHNlO1xuXG4gICAgaWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKCdocmVmJykpIHtcbiAgICAgIHNlbGVjdG9yID0gYFtocmVmPVwiJHtlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpfVwiXWA7XG4gICAgfSBlbHNlIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpKSB7XG4gICAgICBzZWxlY3RvciA9IGBbYXJpYS1jb250cm9scz1cIiR7ZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKX1cIl1gO1xuICAgIH1cblxuICAgIHJldHVybiAoc2VsZWN0b3IpID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikgOiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlIHRoZSBUb2dnbGUgVGFyZ2V0J3MgZm9jdXNhYmxlIGNoaWxkcmVuIGZyb20gZm9jdXMuXG4gICAqIElmIGFuIGVsZW1lbnQgaGFzIHRoZSBkYXRhLWF0dHJpYnV0ZSBgZGF0YS10b2dnbGUtdGFiaW5kZXhgXG4gICAqIGl0IHdpbGwgdXNlIHRoYXQgYXMgdGhlIGRlZmF1bHQgdGFiIGluZGV4IG9mIHRoZSBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gICB7Tm9kZUxpc3R9ICBlbGVtZW50cyAgTGlzdCBvZiBmb2N1c2FibGUgZWxlbWVudHNcbiAgICpcbiAgICogQHJldHVybiAge09iamVjdH0gICAgICAgICAgICAgIFRoZSBUb2dnbGUgSW5zdGFuY2VcbiAgICovXG4gIHRvZ2dsZUZvY3VzYWJsZShlbGVtZW50cykge1xuICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICBsZXQgdGFiaW5kZXggPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcblxuICAgICAgaWYgKHRhYmluZGV4ID09PSAnLTEnKSB7XG4gICAgICAgIGxldCBkYXRhRGVmYXVsdCA9IGVsZW1lbnRcbiAgICAgICAgICAuZ2V0QXR0cmlidXRlKGBkYXRhLSR7VG9nZ2xlLm5hbWVzcGFjZX0tdGFiaW5kZXhgKTtcblxuICAgICAgICBpZiAoZGF0YURlZmF1bHQpIHtcbiAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCBkYXRhRGVmYXVsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogSnVtcHMgdG8gRWxlbWVudCB2aXNpYmx5IGFuZCBzaGlmdHMgZm9jdXNcbiAgICogdG8gdGhlIGVsZW1lbnQgYnkgc2V0dGluZyB0aGUgdGFiaW5kZXhcbiAgICpcbiAgICogQHBhcmFtICAge09iamVjdH0gIGVsZW1lbnQgIFRoZSBUb2dnbGluZyBFbGVtZW50XG4gICAqIEBwYXJhbSAgIHtPYmplY3R9ICB0YXJnZXQgICBUaGUgVGFyZ2V0IEVsZW1lbnRcbiAgICpcbiAgICogQHJldHVybiAge09iamVjdH0gICAgICAgICAgIFRoZSBUb2dnbGUgaW5zdGFuY2VcbiAgICovXG4gIGp1bXBUbyhlbGVtZW50LCB0YXJnZXQpIHtcbiAgICAvLyBSZXNldCB0aGUgaGlzdG9yeSBzdGF0ZS4gVGhpcyB3aWxsIGNsZWFyIG91dFxuICAgIC8vIHRoZSBoYXNoIHdoZW4gdGhlIHRhcmdldCBpcyB0b2dnbGVkIGNsb3NlZFxuICAgIGhpc3RvcnkucHVzaFN0YXRlKCcnLCAnJyxcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuXG4gICAgLy8gRm9jdXMgaWYgYWN0aXZlXG4gICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzcykpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcblxuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgdGFyZ2V0LmZvY3VzKHtwcmV2ZW50U2Nyb2xsOiB0cnVlfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1haW4gdG9nZ2xpbmcgbWV0aG9kIGZvciBhdHRyaWJ1dGVzXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gICAgZWxlbWVudCAgICBUaGUgVG9nZ2xlIGVsZW1lbnRcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgICB0YXJnZXQgICAgIFRoZSBUYXJnZXQgZWxlbWVudCB0byB0b2dnbGUgYWN0aXZlL2hpZGRlblxuICAgKiBAcGFyYW0gIHtOb2RlTGlzdH0gIGZvY3VzYWJsZSAgQW55IGZvY3VzYWJsZSBjaGlsZHJlbiBpbiB0aGUgdGFyZ2V0XG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICBUaGUgVG9nZ2xlIGluc3RhbmNlXG4gICAqL1xuICBlbGVtZW50VG9nZ2xlKGVsZW1lbnQsIHRhcmdldCwgZm9jdXNhYmxlID0gW10pIHtcbiAgICBsZXQgaSA9IDA7XG4gICAgbGV0IGF0dHIgPSAnJztcbiAgICBsZXQgdmFsdWUgPSAnJztcblxuICAgIC8qKlxuICAgICAqIFN0b3JlIGVsZW1lbnRzIGZvciBwb3RlbnRpYWwgdXNlIGluIGNhbGxiYWNrc1xuICAgICAqL1xuXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICB0aGlzLm90aGVycyA9IHRoaXMuZ2V0T3RoZXJzKGVsZW1lbnQpO1xuICAgIHRoaXMuZm9jdXNhYmxlID0gZm9jdXNhYmxlO1xuXG4gICAgLyoqXG4gICAgICogVmFsaWRpdHkgbWV0aG9kIHByb3BlcnR5IHRoYXQgd2lsbCBjYW5jZWwgdGhlIHRvZ2dsZSBpZiBpdCByZXR1cm5zIGZhbHNlXG4gICAgICovXG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy52YWxpZCAmJiAhdGhpcy5zZXR0aW5ncy52YWxpZCh0aGlzKSlcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgLyoqXG4gICAgICogVG9nZ2xpbmcgYmVmb3JlIGhvb2tcbiAgICAgKi9cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmJlZm9yZSlcbiAgICAgIHRoaXMuc2V0dGluZ3MuYmVmb3JlKHRoaXMpO1xuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIEVsZW1lbnQgYW5kIFRhcmdldCBjbGFzc2VzXG4gICAgICovXG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzcykge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUodGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzcyk7XG4gICAgICB0aGlzLnRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKHRoaXMuc2V0dGluZ3MuYWN0aXZlQ2xhc3MpO1xuXG4gICAgICAvLyBJZiB0aGVyZSBhcmUgb3RoZXIgdG9nZ2xlcyB0aGF0IGNvbnRyb2wgdGhlIHNhbWUgZWxlbWVudFxuICAgICAgdGhpcy5vdGhlcnMuZm9yRWFjaChvdGhlciA9PiB7XG4gICAgICAgIGlmIChvdGhlciAhPT0gdGhpcy5lbGVtZW50KVxuICAgICAgICAgIG90aGVyLmNsYXNzTGlzdC50b2dnbGUodGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzcyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5pbmFjdGl2ZUNsYXNzKVxuICAgICAgdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUodGhpcy5zZXR0aW5ncy5pbmFjdGl2ZUNsYXNzKTtcblxuICAgIC8qKlxuICAgICAqIFRhcmdldCBFbGVtZW50IEFyaWEgQXR0cmlidXRlc1xuICAgICAqL1xuXG4gICAgZm9yIChpID0gMDsgaSA8IFRvZ2dsZS50YXJnZXRBcmlhUm9sZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHIgPSBUb2dnbGUudGFyZ2V0QXJpYVJvbGVzW2ldO1xuICAgICAgdmFsdWUgPSB0aGlzLnRhcmdldC5nZXRBdHRyaWJ1dGUoYXR0cik7XG5cbiAgICAgIGlmICh2YWx1ZSAhPSAnJyAmJiB2YWx1ZSlcbiAgICAgICAgdGhpcy50YXJnZXQuc2V0QXR0cmlidXRlKGF0dHIsICh2YWx1ZSA9PT0gJ3RydWUnKSA/ICdmYWxzZScgOiAndHJ1ZScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZSB0aGUgdGFyZ2V0J3MgZm9jdXNhYmxlIGNoaWxkcmVuIHRhYmluZGV4XG4gICAgICovXG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5mb2N1c2FibGUpXG4gICAgICB0aGlzLnRvZ2dsZUZvY3VzYWJsZSh0aGlzLmZvY3VzYWJsZSk7XG5cbiAgICAvKipcbiAgICAgKiBKdW1wIHRvIFRhcmdldCBFbGVtZW50IGlmIFRvZ2dsZSBFbGVtZW50IGlzIGFuIGFuY2hvciBsaW5rXG4gICAgICovXG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5qdW1wICYmIHRoaXMuZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2hyZWYnKSlcbiAgICAgIHRoaXMuanVtcFRvKHRoaXMuZWxlbWVudCwgdGhpcy50YXJnZXQpO1xuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIEVsZW1lbnQgKGluY2x1ZGluZyBtdWx0aSB0b2dnbGVzKSBBcmlhIEF0dHJpYnV0ZXNcbiAgICAgKi9cblxuICAgIGZvciAoaSA9IDA7IGkgPCBUb2dnbGUuZWxBcmlhUm9sZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHIgPSBUb2dnbGUuZWxBcmlhUm9sZXNbaV07XG4gICAgICB2YWx1ZSA9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cik7XG5cbiAgICAgIGlmICh2YWx1ZSAhPSAnJyAmJiB2YWx1ZSlcbiAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCAodmFsdWUgPT09ICd0cnVlJykgPyAnZmFsc2UnIDogJ3RydWUnKTtcblxuICAgICAgLy8gSWYgdGhlcmUgYXJlIG90aGVyIHRvZ2dsZXMgdGhhdCBjb250cm9sIHRoZSBzYW1lIGVsZW1lbnRcbiAgICAgIHRoaXMub3RoZXJzLmZvckVhY2goKG90aGVyKSA9PiB7XG4gICAgICAgIGlmIChvdGhlciAhPT0gdGhpcy5lbGVtZW50ICYmIG90aGVyLmdldEF0dHJpYnV0ZShhdHRyKSlcbiAgICAgICAgICBvdGhlci5zZXRBdHRyaWJ1dGUoYXR0ciwgKHZhbHVlID09PSAndHJ1ZScpID8gJ2ZhbHNlJyA6ICd0cnVlJyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUb2dnbGluZyBjb21wbGV0ZSBob29rXG4gICAgICovXG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5hZnRlcilcbiAgICAgIHRoaXMuc2V0dGluZ3MuYWZ0ZXIodGhpcyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vKiogQHR5cGUgIHtTdHJpbmd9ICBUaGUgbWFpbiBzZWxlY3RvciB0byBhZGQgdGhlIHRvZ2dsaW5nIGZ1bmN0aW9uIHRvICovXG5Ub2dnbGUuc2VsZWN0b3IgPSAnW2RhdGEtanMqPVwidG9nZ2xlXCJdJztcblxuLyoqIEB0eXBlICB7U3RyaW5nfSAgVGhlIG5hbWVzcGFjZSBmb3Igb3VyIGRhdGEgYXR0cmlidXRlIHNldHRpbmdzICovXG5Ub2dnbGUubmFtZXNwYWNlID0gJ3RvZ2dsZSc7XG5cbi8qKiBAdHlwZSAge1N0cmluZ30gIFRoZSBoaWRlIGNsYXNzICovXG5Ub2dnbGUuaW5hY3RpdmVDbGFzcyA9ICdoaWRkZW4nO1xuXG4vKiogQHR5cGUgIHtTdHJpbmd9ICBUaGUgYWN0aXZlIGNsYXNzICovXG5Ub2dnbGUuYWN0aXZlQ2xhc3MgPSAnYWN0aXZlJztcblxuLyoqIEB0eXBlICB7QXJyYXl9ICBBcmlhIHJvbGVzIHRvIHRvZ2dsZSB0cnVlL2ZhbHNlIG9uIHRoZSB0b2dnbGluZyBlbGVtZW50ICovXG5Ub2dnbGUuZWxBcmlhUm9sZXMgPSBbJ2FyaWEtcHJlc3NlZCcsICdhcmlhLWV4cGFuZGVkJ107XG5cbi8qKiBAdHlwZSAge0FycmF5fSAgQXJpYSByb2xlcyB0byB0b2dnbGUgdHJ1ZS9mYWxzZSBvbiB0aGUgdGFyZ2V0IGVsZW1lbnQgKi9cblRvZ2dsZS50YXJnZXRBcmlhUm9sZXMgPSBbJ2FyaWEtaGlkZGVuJ107XG5cbi8qKiBAdHlwZSAge0FycmF5fSAgRm9jdXNhYmxlIGVsZW1lbnRzIHRvIGhpZGUgd2l0aGluIHRoZSBoaWRkZW4gdGFyZ2V0IGVsZW1lbnQgKi9cblRvZ2dsZS5lbEZvY3VzYWJsZSA9IFtcbiAgJ2EnLCAnYnV0dG9uJywgJ2lucHV0JywgJ3NlbGVjdCcsICd0ZXh0YXJlYScsICdvYmplY3QnLCAnZW1iZWQnLCAnZm9ybScsXG4gICdmaWVsZHNldCcsICdsZWdlbmQnLCAnbGFiZWwnLCAnYXJlYScsICdhdWRpbycsICd2aWRlbycsICdpZnJhbWUnLCAnc3ZnJyxcbiAgJ2RldGFpbHMnLCAndGFibGUnLCAnW3RhYmluZGV4XScsICdbY29udGVudGVkaXRhYmxlXScsICdbdXNlbWFwXSdcbl07XG5cbi8qKiBAdHlwZSAge0FycmF5fSAgS2V5IGF0dHJpYnV0ZSBmb3Igc3RvcmluZyB0b2dnbGVzIGluIHRoZSB3aW5kb3cgKi9cblRvZ2dsZS5jYWxsYmFjayA9IFsnVG9nZ2xlc0NhbGxiYWNrJ107XG5cbi8qKiBAdHlwZSAge0FycmF5fSAgRGVmYXVsdCBldmVudHMgdG8gdG8gd2F0Y2ggZm9yIHRvZ2dsaW5nLiBFYWNoIG11c3QgaGF2ZSBhIGhhbmRsZXIgaW4gdGhlIGNsYXNzIGFuZCBlbGVtZW50cyB0byBsb29rIGZvciBpbiBUb2dnbGUuZWxlbWVudHMgKi9cblRvZ2dsZS5ldmVudHMgPSBbJ2NsaWNrJywgJ2NoYW5nZSddO1xuXG4vKiogQHR5cGUgIHtBcnJheX0gIEVsZW1lbnRzIHRvIGRlbGVnYXRlIHRvIGVhY2ggZXZlbnQgaGFuZGxlciAqL1xuVG9nZ2xlLmVsZW1lbnRzID0ge1xuICBDTElDSzogWydBJywgJ0JVVFRPTiddLFxuICBDSEFOR0U6IFsnU0VMRUNUJywgJ0lOUFVUJywgJ1RFWFRBUkVBJ11cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRvZ2dsZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBUaGUgSWNvbiBtb2R1bGVcbiAqIEBjbGFzc1xuICovXG5jbGFzcyBJY29ucyB7XG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtICB7U3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBpY29uIGZpbGVcbiAgICogQHJldHVybiB7b2JqZWN0fSBUaGUgY2xhc3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhdGgpIHtcbiAgICBwYXRoID0gKHBhdGgpID8gcGF0aCA6IEljb25zLnBhdGg7XG5cbiAgICBmZXRjaChwYXRoKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChyZXNwb25zZS5vaylcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJylcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKHJlc3BvbnNlKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKVxuICAgICAgICAgIGNvbnNvbGUuZGlyKGVycm9yKTtcbiAgICAgIH0pXG4gICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICBjb25zdCBzcHJpdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc3ByaXRlLmlubmVySFRNTCA9IGRhdGE7XG4gICAgICAgIHNwcml0ZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG4gICAgICAgIHNwcml0ZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IG5vbmU7Jyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3ByaXRlKTtcbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuLyoqIEB0eXBlIHtTdHJpbmd9IFRoZSBwYXRoIG9mIHRoZSBpY29uIGZpbGUgKi9cbkljb25zLnBhdGggPSAnc3ZnL2ljb25zLnN2Zyc7XG5cbmV4cG9ydCBkZWZhdWx0IEljb25zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgVG9nZ2xlIGZyb20gJ0BueWNvcHBvcnR1bml0eS9wdHRybi1zY3JpcHRzL3NyYy90b2dnbGUvdG9nZ2xlJztcbmltcG9ydCBJY29ucyBmcm9tICdAbnljb3Bwb3J0dW5pdHkvcHR0cm4tc2NyaXB0cy9zcmMvaWNvbnMvaWNvbnMnO1xuXG5jbGFzcyBEZWZhdWx0IHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIHRvZ2dsZSgpIHtcbiAgICByZXR1cm4gbmV3IFRvZ2dsZSgpO1xuICB9XG5cbiAgYWNjb3JkaW9uKCkge1xuICAgIHJldHVybiBuZXcgVG9nZ2xlKHtcbiAgICAgIHNlbGVjdG9yOiAnW2RhdGEtanMqPVwiYWNjb3JkaW9uXCJdJyxcbiAgICAgIGFmdGVyOiAodG9nZ2xlKSA9PiB7XG4gICAgICAgIHRvZ2dsZS5lbGVtZW50LnBhcmVudE5vZGUuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtZXhwYW5kZWQnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBpY29ucyhwYXRoKSB7XG4gICAgcmV0dXJuIG5ldyBJY29ucyhwYXRoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0sTUFBTSxDQUFDO0VBQ2I7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxFQUFFLFdBQVcsQ0FBQyxDQUFDLEVBQUU7RUFDakI7RUFDQSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENB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QUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzNDO0VBQ0E7RUFDQTtFQUNBO0FBQ0E7RUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO0VBQy9ELE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QztFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0VBQ3BELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDbkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUM7RUFDQSxNQUFNLElBQUksS0FBSyxJQUFJLEVBQUUsSUFBSSxLQUFLO0VBQzlCLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxLQUFLLE1BQU0sSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDL0U7RUFDQTtFQUNBLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUs7RUFDckMsUUFBUSxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO0VBQzlELFVBQVUsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEtBQUssTUFBTSxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQztFQUMxRSxPQUFPLENBQUMsQ0FBQztFQUNULEtBQUs7QUFDTDtFQUNBO0VBQ0E7RUFDQTtBQUNBO0VBQ0EsSUFBSSxJ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
