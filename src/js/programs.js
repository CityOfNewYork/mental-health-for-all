'use strict';

import Vue from 'vue/dist/vue.esm.browser';
import ProgramsArchive from '../views/services/archive.vue';
import Services from '../../dist/data/services.json';

/**
 * The class for the Programs Archive
 */
class Programs {
  /**
   * The Programs constructor
   *
   * @return  {Object}  The instance of the Vue app
   */
  constructor() {
    return new Vue({
      extends: ProgramsArchive, // Extend the Archive app here
      data: function() {
        return {
          /**
           * A copy of the Services for our archive view
           *
           * @type {Array}
           */
          services: Object.freeze(Services.map((obj) => Object.freeze(obj))),

          /**
           * This is our custom post type to query
           *
           * @type {String}
           */
          type: 'programs',

          /**
           * Initial query and current query used to request posts via the WP REST
           * API. This JSON object maps directly to the URL query used by the WP
           * REST API.
           *
           * @type {Object}
           */
          // query: {
          //   page: 1,
          //   per_page: 2,
          // },

          /**
           * If the domain where the App is hosted is different from the API domain.
           *
           * @type {String}
           */
          domain: process.env.ROOT,

          /**
           * This is the endpoint list for terms and post requests
           *
           * @type  {Object}
           */
          endpoints: {
            /**
             * A required endpoint for the list of filters
             *
             * @type  {String}
             */
            terms: '/data/terms.json',

            /**
             * A required endpoint for the list of services. This is based on
             * the 'type' setting above.
             *
             * @type  {String}
             */
            programs: '/data/services.json',

            /**
             *
             *
             * @type  {boolean}
             */
            isMounted: false,
          },

          /**
           * Each endpoint above will access a map to take the data from the request
           * and transform it for the app's display purposes
           *
           * @type   {Function}
           *
           * @return {Object}    Object with a mapping function for each endpoint
           */
          maps: function() {
            return {
              /**
               * Programs endpoint data map
               */
              programs: (p) => p,

              /**
               * Terms endpoint data map
               */
              terms: (terms) => ({
                name: terms.name,
                slug: terms.slug,
                filters: terms.programs.map((filters) => ({
                  id: filters.id,
                  name: filters.name,
                  slug: filters.slug,
                  parent: terms.slug,
                  active:
                    this.query.hasOwnProperty(terms.slug) &&
                    this.query[terms.slug].includes(filters.id),
                  checked:
                    this.query.hasOwnProperty(terms.slug) &&
                    this.query[terms.slug].includes(filters.id),
                })),
              }),
            };
          },
        };
      },

      computed: {
        /**
         * Wether there posts to display from the modified query
         *
         * @type {Boolean}
         */
        none: function() {
          // return !this.headers.pages && !this.headers.total;
          // console.dir(this.posts[1].posts.length > 0);
          // return (this.posts && this.posts[1].posts.length > 0) ? true : false;
        },
      },

      /**
       * @type {Object}
       */
      methods: {
        /**
         * Proxy for the click event that toggles the filter.
         *
         * @param   {Object}  toChange  A constructed object containing:
         *                              event - The click event
         *                              data  - The term object
         *
         * @return  {Object}            Vue Instance
         */
        change: function(toChange) {
          this.$set(toChange.data, 'checked', !toChange.data.checked);

          this.click(toChange);

          return this;
        },

        /**
         * Filters the term data and toggles the checked attribute, then, invokes
         * the filtering method.
         *
         * @param   {Object}  event   The click event
         * @param   {String}  parent  The taxonomy parent
         * @param   {Number}  parent  The taxonomy id
         *
         * @return  {Object}          Vue Instance
         */
        link: function(event, parent, id) {
          this.change({
            event: event,
            data: {
              parent: parent,
              id: id
            }
          });

          let term = this.terms.find(t => t.slug === parent)['filters']
            .find(term => term.id === id);

          this.$set(term, 'checked', !term.checked);

          return this;
        },

        /**
         * Generate class names based on population name
         * @param {*} name
         */
        classNameGenerator: function(name) {
          let className = ['bg-' + name.toLowerCase() + '--secondary'];

          return className;
        },

        /**
         * Overrides wpQuery from the archive.vue library which makes the
         * request for the Services data. Since the data is bundled with the
         * application there is no need to make a request. We just mock the
         * promise returned by the original method and returned filtered data.
         *
         * @param  {Object}  query  A WordPress query written in JSON format
         *
         * @return {Promise}        Mocked fetch request with filtered data
         */
        wpQuery: function(query) {
          // Create a safe WP Query using permitted params
          let wpQuery = {};

          Object.keys(query).map((p) => {
            if (this.params.includes(p)) wpQuery[p] = query[p];
          });

          // Build the url query.
          // let url = [
          //   this.domain,
          //   this.lang.path,
          //   this.endpoints[this.type],
          //   this.buildUrlQuery(wpQuery)
          // ].join('');

          // Set posts and store a copy of the query for reference.
          this.$set(this.posts, query.page, {
            posts: [],
            query: Object.freeze(query),
            show: (this.query.page >= query.page),
          });

          /**
           * Create a new promise chain that resolves with the required
           * attributes as well as filtered data inside the json() method.
           *
           * @param   {Function}  resolve  The promise resolver
           */
          return new Promise((resolve) => {
            resolve({
              ok: true,
              headers: new Headers(),
              json: () => (this.mockRequest()),
            });
          });
        },

        /**
         * Returns filtered data that was shipped with this request.
         *
         * @return  {Array}  List of services
         */
        mockRequest: function() {
          let filterdData = [...this.services];

          // After filter if there is no result
          const noResultFound = () => {
            const divContainer = document.createElement('div');
            const title = document.createElement('h2');
            const tileText = document.createTextNode(
              'Sorry, no results were found.'
            );

            title.appendChild(tileText);

            const node = document.createElement('p');
            const textnode = document.createTextNode(
              'It looks like there aren’t any services for the filters you selected at this moment.'
            );

            node.appendChild(textnode);
            divContainer.appendChild(title);
            divContainer.appendChild(node);

            document
              .querySelector('[data-js="filtered-results"]')
              .appendChild(divContainer);
          };

          if (this.query.cat && this.query.pop) {
            if (this.query.cat.length === 0 && this.query.pop.length === 0)
              filterdData = [...this.services];

            else if (this.query.cat.length > 0 && this.query.pop.length > 0) {
              filterdData = [...this.services].filter((service) => {
                let filtered =
                  service.categories.some((category) =>
                    this.query.cat.includes(category.id)
                  ) &&
                  service.population.some((people) =>
                    this.query.pop.includes(people.id)
                  );
                return filtered;
              });

              filterdData.length === 0 && noResultFound();
            } else if (
              this.query.cat.length > 0 &&
              this.query.pop.length === 0
            ) {
              filterdData = [...this.services].filter((service) => {
                let filteredCat = service.categories.some((category) =>
                  this.query.cat.includes(category.id)
                );
                return filteredCat;
              });

              filterdData.length === 0 && noResultFound();
            } else if (
              this.query.pop.length > 0 &&
              this.query.cat.length === 0
            ) {
              filterdData = [...this.services].filter((service) => {
                let filteredPop = service.population.some((people) =>
                  this.query.pop.includes(people.id)
                );

                return filteredPop;
              });

              filterdData.length === 0 && noResultFound();
            }
          } else if (this.query.cat && !this.query.pop) {
            if (this.query.cat.length > 0) {
              filterdData = [...this.services].filter((service) => {
                let filteredCat = service.categories.some((category) =>
                  this.query.cat.includes(category.id)
                );
                return filteredCat;
              });

              filterdData.length === 0 && noResultFound();
            }
          } else if (this.query.pop && !this.query.cat)
            if (this.query.pop.length > 0) {
              filterdData = [...this.services].filter((service) => {
                let filteredPop = service.population.some((people) =>
                  this.query.pop.includes(people.id)
                );

                return filteredPop;
              });

              filterdData.length === 0 && noResultFound();
            }

          filterdData = this.sortByTaxonomy(filterdData, 'population', 5); // Children / Youth
          filterdData = this.sortByTaxonomy(filterdData, 'population', 2); // Families

          return filterdData;
        },

        /**
         * Sort the list of services by a taxonomy name and category ID.
         *
         * @param   {Array}   services  The services data to sort
         * @param   {String}  taxonomy  The taxonomy to sort
         * @param   {Number}  id        The category ID to compare
         * @param   {Number}  order     Ascending (-1) or Descending (1) order
         *
         * @return  {Array}             Sorted services data
         */
        sortByTaxonomy: function(services, taxonomy, id, order = 1) {
          return services.sort((a, b) => {
            // check a and b populations contain a specific taxonomy ID
            let popA = a[taxonomy].filter(p => p.id === id);
            let popB = b[taxonomy].filter(p => p.id === id);

            if (popA.length < popB.length)
              return order;

            if (popA.length > popB.length)
              return -(order);

            return 0;
          });
        },

        /**
         * Change string into slug,
         * removes space and special characters,
         * cahnge to lowercase
         *
         * @param  {string}  title  Program title
         *
         * @return {string}        Slugified version of the title string
         */

        slugify: function(string) {
          return string
            .toLowerCase()
            .replace(/[^0-9a-zA-Z - _]+/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        },
      },

      /**
       * The created hook starts the application
       *
       * @url https://vuejs.org/v2/api/#created
       *
       * @type {Function}
       */
      created: function() {
        // Add custom taxonomy queries to the list of safe params
        this.params.push('program-filter');

        // Initialize the application
        this.getState() // Get window.location.search (filtering history)
          .queue() // Queue up the first request
          .fetch('terms') // Get the terms from the 'terms' endpoint
          .catch(this.error);
        },
      updated: function() {
        this.$nextTick(function () {
          // Code that will run only after the
          // entire view has been rendered
            if (!this.isMounted && window.innerWidth > SCREEN_LARGE) {
              if (document.querySelector('#aria-c-cat') != null)
                window.gunyc.toggleTrigger('#aria-c-cat');

              if (document.querySelector('#aria-c-pop') != null) {
                window.gunyc.toggleTrigger('#aria-c-pop');

                this.isMounted = true;
              }
            }
          })

      },
    }).$mount('[data-js="programs"]');
  }
}

export default Programs;
