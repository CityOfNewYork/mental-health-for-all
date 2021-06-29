var Archive = (function () {
  'use strict';

  /**
     * WordPress Archive Vue. Creates a filterable reactive interface using Vue.js
     * for a WordPress Archive. Uses the WordPress REST API for retrieving filters
     * and posts. Fully configurable for any post type (default or custom). Works
     * with multiple languages using the lang attribute set in on the html tag
     * and the multilingual url endpoint provided by WPML.
     *
     * This component does not include a default template but it can be extended
     * by a parent component and configured with the template, script, or style
     * tags.
     */
    var script = {
      props: {
        strings: {type: Object}
      },
      data: () => ({
        /**
         * Wether the app has been initialized or not
         *
         * @type {Boolean}
         */
        init: false,

        /**
         * The post type to query. Overide this with a custom post type
         *
         * @type {String}
         */
        type: 'posts',

        /**
         * Post type terms, used to filter visible posts. Terms are a custom built
         * object provided by a custom endpoint set in `register-rest-routes.php`.
         * This endpoint must be present for the app to provide filtering by
         * terms.
         *
         * @type {Array}
         */
        terms: [],

        /**
         * Initial query and current query used to request posts via the WP REST
         * API. This JSON object maps directly to the URL query used by the WP
         * REST API.
         *
         * @type {Object}
         */
        query: {
          page: 1,
          per_page: 5
        },

        /**
         * This is a list of 'safe' params to use with the WP REST API query.
         * Other parameters can create conflicts. This list is based on the
         * WP REST API /posts endpoint arguments;
         * https://developer.wordpress.org/rest-api/reference/posts/#arguments
         *
         * This array can be extended to include custom params such as taxonomies
         *
         * @type {Array}
         */
        params: [
          'context',
          'page',
          'per_page',
          'search',
          'after',
          'author',
          'author_exclude',
          'before',
          'exclude',
          'include',
          'offset',
          'order',
          'orderby',
          'slug',
          'status',
          'tax_relation',
          'categories',
          'categories_exclude',
          'tags',
          'tags_exclude',
          'sticky'
        ],

        /**
         * Initial headers and current headers of visible posts. Headers are used
         * to determine if there are additional pages surrounding a query.
         *
         * @type {Object}
         */
        headers: {
          pages: 0,
          total: 0,
          link: 'rel="next";'
        },

        /**
         * This is the endpoint list for terms and post requests. The terms
         * endpoint does not exist in WordPress by default so it needs to be
         * created via the 'register_rest_route' filter.
         *
         * @type {Object}
         */
        endpoints: {
          terms: '/wp-json/api/v1/terms',
          posts: '/wp-json/wp/v2/posts'
        },

        /**
         * If the domain where the App is hosted is different from the API domain.
         *
         * @type {String}
         */
        domain: '',

        /**
         * Each endpoint above will access a map to take the data from the request
         * and transform it for the app's display purposes.
         *
         * @type   {Function}
         *
         * @return {Object}    Object with a mapping function for each endpoint
         */
        maps: function() {
          return {
            terms: terms => ({
              active: false,
              name: terms.labels.archives,
              slug: terms.name,
              checkbox: false,
              toggle: true,
              filters: terms.terms.map(filters => ({
                id: filters.term_id,
                name: filters.name,
                slug: filters.slug,
                parent: terms.name,
                active: (
                    this.query.hasOwnProperty(terms.name) &&
                    this.query[terms.name].includes(filters.term_id)
                  ),
                checked: (
                    this.query.hasOwnProperty(terms.name) &&
                    this.query[terms.name].includes(filters.term_id)
                  )
              }))
            }),
            posts: p => ({
              title: p.title.rendered,
              link: p.link,
              excerpt: p.excerpt.rendered
            })
          };
        },

        /**
         * Initial history and current history of visible posts. This is used
         * to configure how the URL of the page is rewritten. It can include
         * parameters to omit and a mapping object that will convert WP Query vars
         * vars to WP REST query vars. This prevents conflicts with the original
         * WP Query.
         *
         * filterSafe determines wether to filter the safe params from the history
         * replaceState method.
         *
         * @type {Object}
         */
        history: {
          omit: [
            'page',
            'per_page'
          ],
          map: {
            // ex; 'wordpress-query-var': 'vue-app-query-var'
          },
          filterParams: false
        },

        /**
         * Storage for all Post content, this is set when posts are queried. Post
         * content is organized by pages. Each page is an object that includes a
         * headers object, posts object (actual content), query object (the
         * original query for the page), and show boolean that determines if it
         * should be visible. The first page will always be undefined. When the
         * query is modified by selecting taxonomies to filter on, this entire
         * history is rewritten.
         *
         * @type {Array}
         */
        posts: [
          // undefined
          // {
          //   headers: { ... },
          //   posts: [ ... post content ... ],
          //   query: { ... },
          //   show: true
          // }
        ],
      }),
      computed: {
        /**
         * Wether there are no posts to show but a query is being made
         *
         * @type {Boolean}
         */
        loading: function() {
          if (!this.posts.length) return false;

          let page = this.posts[this.query.page];

          return this.init && !page.posts.length && page.show;
        },

        /**
         * Wether there posts to display from the modified query
         *
         * @type {Boolean}
         */
        none: function() {
          return !this.headers.pages && !this.headers.total;
        },

        /**
         * Wether there is another page or not
         *
         * @type {Boolean}
         */
        next: function() {
          let number = this.query.page;
          let total = this.headers.pages;

          if (!this.posts.length) return false;

          let page = this.posts[number];

          return (number < total) && (page.posts.length && page.show);
        },

        /**
         * Wether there is a previous page or not
         *
         * @type {Boolean}
         */
        previous: function() {
          return (this.query.page > 1);
        },

        /**
         * Wether posts are currently being filtered
         *
         * @type {Boolean}
         */
        filtering: function() {
          if (!this.init) return false;

          return (this.terms.find(t => t.active)) ? true : false;
        },

        /**
         * The language of the document (and query)
         *
         * @type {String}
         */
        lang: () => {
          let lang = document.querySelector('html').lang;

          return (lang !== 'en') ? {
            code: lang,
            path: `/${lang}`
          } : {
            code: 'en',
            path: ''
          };
        }
      },
      methods: {
        /**
         * Converts a JSON object to URL Query. Opposite of buildJsonQuery.
         *
         * @param  {Object} query  URL Query structured as JSON Object.
         * @param  {Array}  omit   Set of params as flags to not include in
         *                         the returned query string.
         * @param  {Object} rev    Set of parameter maps to replace provided
         *                         param names in the query.
         *
         * @return {String}        The query string.
         */
        buildUrlQuery: function(query, omit = false, rev = false) {
          let q = Object.keys(query)
            .map(k => {
              if (omit && omit.includes(k)) return false;

              let map = (rev && rev.hasOwnProperty(k)) ? rev[k] : k;

              if (Array.isArray(query[k]))
                return query[k].map(a => `${map}[]=${a}`).join('&');
              return `${map}=${query[k]}`;
            }).filter(k => (k)).join('&');

          return (q !== '') ? '?' + q : '';
        },

        /**
         * Converts a URL Query String to a JSON Object. Opposite of buildUrlQuery.
         *
         * @param  {String} query  URL Query String.
         *
         * @return {Object}         URL Query structured as JSON Object.
         */
        buildJsonQuery: function(query) {
          if (query === '') return false;

          let params = new URLSearchParams(query);
          let q = {};

          // Set keys in object and get values, convert to number (!NaN)
          params.forEach(function(value, key) {
            let k = key.replace('[]', '');

            if (!q.hasOwnProperty(k))
              q[k] = params.getAll(key).map(value => {
                return (isNaN(value)) ? value : +value;
              });
          });

          // Reverse map the parameters to the actual query vars
          Object.keys(this.history.map).map(key => {
            if (q.hasOwnProperty(this.history.map[key])) {
              q[key] = q[this.history.map[key]];
              delete q[this.history.map[key]];
            }
          });

          return q;
        },

        /**
         * Set the URL Query
         *
         * @param  {Object} query  URL Query structured as JSON Object.
         *
         * @return {Object}        Vue instance
         */
        replaceState: function(query) {
          let history = {};

          // Filter safe params for the history query
          if (this.history.filterParams) {
            Object.keys(query).map(p => {
              if (this.params.includes(p)) {
                history[p] = query[p];
              }
            });
          } else {
            history = query;
          }

          let state = this.buildUrlQuery(history, this.history.omit, this.history.map);

          window.history.replaceState(null, null, window.location.pathname + state);

          return this;
        },

        /**
         * Basic fetch for retrieving data from an endpoint configured in the
         * data.endpoints property.
         *
         * @param  {Object}  data  A key representing an endpoint configured in
         *                         the data.endpoints property.
         *
         * @return {Promise}       The fetch request for that endpoint.
         */
        fetch: function(data = false) {
          if (!data) return data;

          return (this[data].length) ? this[data] :
            fetch(`${this.domain}${this.lang.path}${this.endpoints[data]}`)
              .then(response => response.json())
              .then(d => {
                this.$set(this, data, d.map(this.maps()[data]));
              });
        },

        /**
         * The click event to begin filtering.
         *
         * @param  {Object} event  The click event on the element that triggers
         *                         the filter.
         *
         * @return {Object}        Vue instance
         */
        click: function(event) {
          let taxonomy = event.data.parent;
          let term = event.data.id || false;

          if (term) {
            this.filter(taxonomy, term);
          } else {
            this.filterAll(taxonomy);
          }

          return this;
        },

        /**
         * The reset event to toggle all filters.
         *
         * @param  {Object} event  The click event on the element that triggers
         *                         the filter.
         *
         * @return {Object}        Vue instance
         */
        toggle: function(event) {
          let taxonomy = event.data.parent;
          this.filterAll(taxonomy);

          return this;
        },

        /**
         * Single filter function. If the filter is already present in the query
         * it will add the filter to the query.
         *
         * @param  {String} taxonomy  The taxonomy slug of the filter
         * @param  {Number} term      The id of the term to filter on
         *
         * @return {Object}           Vue instance
         */
        filter: function(taxonomy, term) {
          let terms = (this.query.hasOwnProperty(taxonomy)) ?
            this.query[taxonomy] : [term]; // get other query or initialize.

          // Toggle, if the taxonomy exists, filter it out, otherwise add it.
          if (this.query.hasOwnProperty(taxonomy))
            terms = (terms.includes(term)) ?
              terms.filter(el => el !== term) : terms.concat([term]);

          this.updateQuery(taxonomy, terms);

          return this;
        },

        /**
         * A control for filtering all of the terms in a particular taxonomy on
         * or off.
         *
         * @param  {String} taxonomy  The taxonomy slug of the filter
         *
         * @return {Object}           Vue instance
         */
        filterAll: function(taxonomy) {
          let tax = this.terms.find(t => t.slug === taxonomy);
          let checked = !(tax.checked);

          this.$set(tax, 'checked', checked);

          let terms = tax.filters.map(term => {
              this.$set(term, 'checked', checked);
              return term.id;
            });

          this.updateQuery(taxonomy, (checked) ? terms : []);

          return this;
        },

        /**
         * This updates the query property with the new filters.
         *
         * @param  {String}  taxonomy  The taxonomy slug of the filter
         * @param  {Array}   terms     Array of term ids
         *
         * @return {Promise}           Resolves when the terms are updated
         */
        updateQuery: function(taxonomy, terms) {
          return new Promise((resolve) => { // eslint-disable-line no-undef
            this.$set(this.query, taxonomy, terms);
            this.$set(this.query, 'page', 1);

            // hide all of the posts
            this.posts.map((value, index) => {
              if (value) this.$set(this.posts[index], 'show', false);
              return value;
            });

            resolve();
          })
          .then(this.wp)
          .catch(message => {
            // eslint-disable-next-line no-undef
            {
              console.dir(message);
            }
          });
        },

        /**
         * A function to reset the filters to "All Posts."
         *
         * @param  {Object}  event  The taxonomy slug of the filter
         *
         * @return {Promise}        Resolves after resetting the filter
         */
        reset: function(event) {
          return new Promise(resolve => { // eslint-disable-line no-undef
            let taxonomy = event.data.slug;
            if (this.query.hasOwnProperty(taxonomy)) {
              this.$set(this.query, taxonomy, []);
              resolve();
            }
          });
        },

        /**
         * A function to paginate up or down a post's list based on the change amount
         * assigned to the clicked element.
         *
         * @param  {Object}  event  The click event of the pagination element
         *
         * @return {Promise}        Resolves after updating the pagination in the
         *                          query
         */
        paginate: function(event) {
          event.preventDefault();

          // The change is the next page as well as an indication of what
          // direction we are moving in for the queue.
          let change = parseInt(event.target.dataset.amount);
          let page = this.query.page + change;

          return new Promise(resolve => { // eslint-disable-line no-undef
            this.$set(this.query, 'page', page);
            this.$set(this.posts[this.query.page], 'show', true);

            this.queue([0, change]);
            resolve();
          });
        },

        /**
         * Wrapper for the queue promise
         *
         * @return {Promise} Returns the queue function.
         */
        wp: function() {
          return this.queue();
        },

        /**
         * This queues the current post request and the next request based on the
         * direction of pagination. It uses an Async method to retrieve the
         * requests in order so that we can determine if there are more posts to
         * show after the request for the current view.
         *
         * @param  {Array}  queries  The amount of queries to make and which
         *                           direction to make them in. 0 means the
         *                           current page, 1 means the next page. -1
         *                           would mean the previous page.
         *
         * @return {Object}          Vue instance.
         */
        queue: function(queries = [0, 1]) {
          // Set a benchmark query to compare the upcomming query to.
          let Obj1 = Object.assign({}, this.query); // create copy of object.
          delete Obj1.page; // delete the page attribute because it will be different.
          Object.freeze(Obj1); // prevent changes to our comparison.

          // The function is async because we want to wait until each promise
          // is query is finished before we run the next. We don't want to bother
          // sending a request if there are no previous or next pages. The way we
          // find out if there are previous or next pages relative to the current
          // page query is through the headers of the response provided by the
          // WP REST API.
          (async () => {
            for (let i = 0; i < queries.length; i++) {
              let query = Object.assign({}, this.query);
              // eslint-disable-next-line no-undef
              let promise = new Promise(resolve => resolve());
              let pages = this.headers.pages;
              let page = this.query.page;
              let current = false;
              let next = false;
              let previous = false;

              // Build the query and set its page number.
              Object.defineProperty(query, 'page', {
                value: page + queries[i],
                enumerable: true
              });

              // There will never be a page 0 or below, so skip this query.
              if (query.page <= 0) continue;

              // Check to see if we have the page that we are going to queued
              // and the query structure of that page matches the current query
              // structure (other than the page, which will obviously be
              // different). This will help us determine if we need to make a new
              // request.
              let havePage = (this.posts[query.page]) ? true : false;
              let pageQueryMatches = false;

              if (havePage) {
                let Obj2 = Object.assign({}, this.posts[query.page].query);
                delete Obj2.page;
                pageQueryMatches = (JSON.stringify(Obj1) === JSON.stringify(Obj2));
              }

              if (havePage && pageQueryMatches) continue;

              // If this is the current page we want the query to go through.
              current = (query.page === page);

              // If there is a next or previous page, we'll prefetch them.
              // We'll know there's a next or previous page based on the
              // headers sent by the current page query.
              next = (page < pages && query.page > page);
              previous = (page > 1 && query.page < page);

              if (current || next || previous)
                await promise.then(() => {
                  return this.wpQuery(query);
                })
                .then(this.response)
                .then(data => {
                  let headers = Object.assign({}, this.headers);

                  // If this is the current page, replace the browser history state.
                  if (current) this.replaceState(query);

                  this.process(data, query, headers);
                }).catch(this.error);
            }
          })();

          return this;
        },

        /**
         * Builds the URL query from the provided query property.
         *
         * @param  {Object}  query  A WordPress query written in JSON format
         *
         * @return {Promise}        The fetch request for the query
         */
        wpQuery: function(query) {
          // Create a safe WP Query using permitted params
          let wpQuery = {};

          Object.keys(query).map(p => {
            if (this.params.includes(p))
              wpQuery[p] = query[p];
          });

          // Build the url query.
          let url = [
            this.domain,
            this.lang.path,
            this.endpoints[this.type],
            this.buildUrlQuery(wpQuery)
          ].join('');

          // Set posts and store a copy of the query for reference.
          this.$set(this.posts, query.page, {
            posts: [],
            query: Object.freeze(query),
            show: (this.query.page >= query.page)
          });

          return fetch(url);
        },

        /**
         * Handles the response, setting the headers of the query and returning
         * the response as JSON.
         *
         * @return {Object} The response object as JSON
         */
        response: function(response) {
          let headers = {
            total: 'X-WP-Total',
            pages: 'X-WP-TotalPages',
            link: 'Link'
          };

          if (response.ok) {
            let keys = Object.keys(headers);

            for (let i = 0; i < keys.length; i++) {
              let header = response.headers.get(headers[keys[i]]);
              let value = (isNaN(header)) ? header : (parseInt(header) || 0);
              headers[keys[i]] = value;
            }

            this.$set(this, 'headers', headers);
          }

          return response.json();
        },

        /**
         * Processes the posts and maps the data to data maps provided by the
         * data.maps property.
         *
         * @param {Object} data     The post data retrieved from the WP REST API
         * @param {Object} query    The the query used to get the data
         * @param {Object} headers  The the headers of the request
         */
        process: function(data, query, headers) {
          // If there are posts for this query, map them to the template.
          let posts = (Array.isArray(data)) ?
            data.map(this.maps()[this.type]) : false;

          // Set posts and store a copy of the query for reference.
          this.$set(this.posts[query.page], 'posts', posts);
          this.$set(this.posts[query.page], 'headers', Object.freeze(headers));

          // If there are no posts, pass along to the error handler.
          if (!Array.isArray(data))
            this.error({error: data, query: query});

          this.$set(this, 'init', true);
        },

        /**
         * Error response thrown when there is an error in the WP REST AP request.
         *
         * @param {Object} response  The error response
         */
        error: function(response) {
          // eslint-disable-next-line no-undef
          {
            console.dir(response);
          }
        },

        /**
         * Convert the current Query or a passed query to JS readable format
         *
         * @param  {String} query  An existing query to parse
         *
         * @return {Object}         Query as a JSON object
         */
        getState: function(query = false) {
          query = (query) ? query : this.buildJsonQuery(window.location.search);

          Object.keys(query).map(key => {
            this.$set(this.query, key, query[key]);
          });

          return this;
        }
      }
    };

  script.__file = "node_modules/@nycopportunity/wp-archive-vue/src/archive.vue";

  var archive = {
    extends: script, // Extend the Archive app here
    data: function() {
      return {
        /**
         * This is our custom post type to query
         *
         * @type {String}
         */
        type: 'programs',

        /**
         * This is the endpoint list for terms and post requests
         *
         * @type  {Object}
         *
         * @param {String} terms     A required endpoint for the list of filters
         * @param {String} programs  This is based on the 'type' setting above
         */
        endpoints: {
          terms: '/data/filter.json',
          programs: '/data/services.json',
        },

        /**
         * This is the domain for our local WordPress installation.
         *
         * @type {String}
         */
        domain: 'http://localhost:8080',

        /**
         * Each endpoint above will access a map to take the data from the request
         * and transform it for the app's display purposes
         *
         * @type   {Function}
         *
         * @return {Object}    Object with a mapping function for each endpoint
         */
        maps: function() {
          const progFiter = {
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
                id: filters.term_id,
                name: filters.name,
                slug: filters.slug,
                parent: terms.name,
                active:
                  this.query.hasOwnProperty(terms.name) &&
                  this.query[terms.name].includes(filters.term_id),
                checked:
                  this.query.hasOwnProperty(terms.name) &&
                  this.query[terms.name].includes(filters.term_id),
              })),
            }),
          };
          console.log('progFiter:', progFiter);
        },
      };
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
      ['programs', 'populations-served'].map((p) => {
        this.params.push(p);
      });

      // Initialize the application
      this.getState() // Get window.location.search (filter history)
        .queue() // Initialize the first page request
        .fetch('terms') // Get the terms from the 'terms' endpoint
        .catch(this.error);
    },
  };

  return archive;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjaGl2ZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL0BueWNvcHBvcnR1bml0eS93cC1hcmNoaXZlLXZ1ZS9zcmMvYXJjaGl2ZS52dWUiLCIuLi8uLi9zcmMvanMvYXJjaGl2ZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICAvKipcbiAgICogV29yZFByZXNzIEFyY2hpdmUgVnVlLiBDcmVhdGVzIGEgZmlsdGVyYWJsZSByZWFjdGl2ZSBpbnRlcmZhY2UgdXNpbmcgVnVlLmpzXG4gICAqIGZvciBhIFdvcmRQcmVzcyBBcmNoaXZlLiBVc2VzIHRoZSBXb3JkUHJlc3MgUkVTVCBBUEkgZm9yIHJldHJpZXZpbmcgZmlsdGVyc1xuICAgKiBhbmQgcG9zdHMuIEZ1bGx5IGNvbmZpZ3VyYWJsZSBmb3IgYW55IHBvc3QgdHlwZSAoZGVmYXVsdCBvciBjdXN0b20pLiBXb3Jrc1xuICAgKiB3aXRoIG11bHRpcGxlIGxhbmd1YWdlcyB1c2luZyB0aGUgbGFuZyBhdHRyaWJ1dGUgc2V0IGluIG9uIHRoZSBodG1sIHRhZ1xuICAgKiBhbmQgdGhlIG11bHRpbGluZ3VhbCB1cmwgZW5kcG9pbnQgcHJvdmlkZWQgYnkgV1BNTC5cbiAgICpcbiAgICogVGhpcyBjb21wb25lbnQgZG9lcyBub3QgaW5jbHVkZSBhIGRlZmF1bHQgdGVtcGxhdGUgYnV0IGl0IGNhbiBiZSBleHRlbmRlZFxuICAgKiBieSBhIHBhcmVudCBjb21wb25lbnQgYW5kIGNvbmZpZ3VyZWQgd2l0aCB0aGUgdGVtcGxhdGUsIHNjcmlwdCwgb3Igc3R5bGVcbiAgICogdGFncy5cbiAgICovXG4gIGV4cG9ydCBkZWZhdWx0IHtcbiAgICBwcm9wczoge1xuICAgICAgc3RyaW5nczoge3R5cGU6IE9iamVjdH1cbiAgICB9LFxuICAgIGRhdGE6ICgpID0+ICh7XG4gICAgICAvKipcbiAgICAgICAqIFdldGhlciB0aGUgYXBwIGhhcyBiZWVuIGluaXRpYWxpemVkIG9yIG5vdFxuICAgICAgICpcbiAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICovXG4gICAgICBpbml0OiBmYWxzZSxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgcG9zdCB0eXBlIHRvIHF1ZXJ5LiBPdmVyaWRlIHRoaXMgd2l0aCBhIGN1c3RvbSBwb3N0IHR5cGVcbiAgICAgICAqXG4gICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICovXG4gICAgICB0eXBlOiAncG9zdHMnLFxuXG4gICAgICAvKipcbiAgICAgICAqIFBvc3QgdHlwZSB0ZXJtcywgdXNlZCB0byBmaWx0ZXIgdmlzaWJsZSBwb3N0cy4gVGVybXMgYXJlIGEgY3VzdG9tIGJ1aWx0XG4gICAgICAgKiBvYmplY3QgcHJvdmlkZWQgYnkgYSBjdXN0b20gZW5kcG9pbnQgc2V0IGluIGByZWdpc3Rlci1yZXN0LXJvdXRlcy5waHBgLlxuICAgICAgICogVGhpcyBlbmRwb2ludCBtdXN0IGJlIHByZXNlbnQgZm9yIHRoZSBhcHAgdG8gcHJvdmlkZSBmaWx0ZXJpbmcgYnlcbiAgICAgICAqIHRlcm1zLlxuICAgICAgICpcbiAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAqL1xuICAgICAgdGVybXM6IFtdLFxuXG4gICAgICAvKipcbiAgICAgICAqIEluaXRpYWwgcXVlcnkgYW5kIGN1cnJlbnQgcXVlcnkgdXNlZCB0byByZXF1ZXN0IHBvc3RzIHZpYSB0aGUgV1AgUkVTVFxuICAgICAgICogQVBJLiBUaGlzIEpTT04gb2JqZWN0IG1hcHMgZGlyZWN0bHkgdG8gdGhlIFVSTCBxdWVyeSB1c2VkIGJ5IHRoZSBXUFxuICAgICAgICogUkVTVCBBUEkuXG4gICAgICAgKlxuICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAqL1xuICAgICAgcXVlcnk6IHtcbiAgICAgICAgcGFnZTogMSxcbiAgICAgICAgcGVyX3BhZ2U6IDVcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhpcyBpcyBhIGxpc3Qgb2YgJ3NhZmUnIHBhcmFtcyB0byB1c2Ugd2l0aCB0aGUgV1AgUkVTVCBBUEkgcXVlcnkuXG4gICAgICAgKiBPdGhlciBwYXJhbWV0ZXJzIGNhbiBjcmVhdGUgY29uZmxpY3RzLiBUaGlzIGxpc3QgaXMgYmFzZWQgb24gdGhlXG4gICAgICAgKiBXUCBSRVNUIEFQSSAvcG9zdHMgZW5kcG9pbnQgYXJndW1lbnRzO1xuICAgICAgICogaHR0cHM6Ly9kZXZlbG9wZXIud29yZHByZXNzLm9yZy9yZXN0LWFwaS9yZWZlcmVuY2UvcG9zdHMvI2FyZ3VtZW50c1xuICAgICAgICpcbiAgICAgICAqIFRoaXMgYXJyYXkgY2FuIGJlIGV4dGVuZGVkIHRvIGluY2x1ZGUgY3VzdG9tIHBhcmFtcyBzdWNoIGFzIHRheG9ub21pZXNcbiAgICAgICAqXG4gICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgKi9cbiAgICAgIHBhcmFtczogW1xuICAgICAgICAnY29udGV4dCcsXG4gICAgICAgICdwYWdlJyxcbiAgICAgICAgJ3Blcl9wYWdlJyxcbiAgICAgICAgJ3NlYXJjaCcsXG4gICAgICAgICdhZnRlcicsXG4gICAgICAgICdhdXRob3InLFxuICAgICAgICAnYXV0aG9yX2V4Y2x1ZGUnLFxuICAgICAgICAnYmVmb3JlJyxcbiAgICAgICAgJ2V4Y2x1ZGUnLFxuICAgICAgICAnaW5jbHVkZScsXG4gICAgICAgICdvZmZzZXQnLFxuICAgICAgICAnb3JkZXInLFxuICAgICAgICAnb3JkZXJieScsXG4gICAgICAgICdzbHVnJyxcbiAgICAgICAgJ3N0YXR1cycsXG4gICAgICAgICd0YXhfcmVsYXRpb24nLFxuICAgICAgICAnY2F0ZWdvcmllcycsXG4gICAgICAgICdjYXRlZ29yaWVzX2V4Y2x1ZGUnLFxuICAgICAgICAndGFncycsXG4gICAgICAgICd0YWdzX2V4Y2x1ZGUnLFxuICAgICAgICAnc3RpY2t5J1xuICAgICAgXSxcblxuICAgICAgLyoqXG4gICAgICAgKiBJbml0aWFsIGhlYWRlcnMgYW5kIGN1cnJlbnQgaGVhZGVycyBvZiB2aXNpYmxlIHBvc3RzLiBIZWFkZXJzIGFyZSB1c2VkXG4gICAgICAgKiB0byBkZXRlcm1pbmUgaWYgdGhlcmUgYXJlIGFkZGl0aW9uYWwgcGFnZXMgc3Vycm91bmRpbmcgYSBxdWVyeS5cbiAgICAgICAqXG4gICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICovXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIHBhZ2VzOiAwLFxuICAgICAgICB0b3RhbDogMCxcbiAgICAgICAgbGluazogJ3JlbD1cIm5leHRcIjsnXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgaXMgdGhlIGVuZHBvaW50IGxpc3QgZm9yIHRlcm1zIGFuZCBwb3N0IHJlcXVlc3RzLiBUaGUgdGVybXNcbiAgICAgICAqIGVuZHBvaW50IGRvZXMgbm90IGV4aXN0IGluIFdvcmRQcmVzcyBieSBkZWZhdWx0IHNvIGl0IG5lZWRzIHRvIGJlXG4gICAgICAgKiBjcmVhdGVkIHZpYSB0aGUgJ3JlZ2lzdGVyX3Jlc3Rfcm91dGUnIGZpbHRlci5cbiAgICAgICAqXG4gICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICovXG4gICAgICBlbmRwb2ludHM6IHtcbiAgICAgICAgdGVybXM6ICcvd3AtanNvbi9hcGkvdjEvdGVybXMnLFxuICAgICAgICBwb3N0czogJy93cC1qc29uL3dwL3YyL3Bvc3RzJ1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBJZiB0aGUgZG9tYWluIHdoZXJlIHRoZSBBcHAgaXMgaG9zdGVkIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBBUEkgZG9tYWluLlxuICAgICAgICpcbiAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgKi9cbiAgICAgIGRvbWFpbjogJycsXG5cbiAgICAgIC8qKlxuICAgICAgICogRWFjaCBlbmRwb2ludCBhYm92ZSB3aWxsIGFjY2VzcyBhIG1hcCB0byB0YWtlIHRoZSBkYXRhIGZyb20gdGhlIHJlcXVlc3RcbiAgICAgICAqIGFuZCB0cmFuc2Zvcm0gaXQgZm9yIHRoZSBhcHAncyBkaXNwbGF5IHB1cnBvc2VzLlxuICAgICAgICpcbiAgICAgICAqIEB0eXBlICAge0Z1bmN0aW9ufVxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgT2JqZWN0IHdpdGggYSBtYXBwaW5nIGZ1bmN0aW9uIGZvciBlYWNoIGVuZHBvaW50XG4gICAgICAgKi9cbiAgICAgIG1hcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRlcm1zOiB0ZXJtcyA9PiAoe1xuICAgICAgICAgICAgYWN0aXZlOiBmYWxzZSxcbiAgICAgICAgICAgIG5hbWU6IHRlcm1zLmxhYmVscy5hcmNoaXZlcyxcbiAgICAgICAgICAgIHNsdWc6IHRlcm1zLm5hbWUsXG4gICAgICAgICAgICBjaGVja2JveDogZmFsc2UsXG4gICAgICAgICAgICB0b2dnbGU6IHRydWUsXG4gICAgICAgICAgICBmaWx0ZXJzOiB0ZXJtcy50ZXJtcy5tYXAoZmlsdGVycyA9PiAoe1xuICAgICAgICAgICAgICBpZDogZmlsdGVycy50ZXJtX2lkLFxuICAgICAgICAgICAgICBuYW1lOiBmaWx0ZXJzLm5hbWUsXG4gICAgICAgICAgICAgIHNsdWc6IGZpbHRlcnMuc2x1ZyxcbiAgICAgICAgICAgICAgcGFyZW50OiB0ZXJtcy5uYW1lLFxuICAgICAgICAgICAgICBhY3RpdmU6IChcbiAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkuaGFzT3duUHJvcGVydHkodGVybXMubmFtZSkgJiZcbiAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnlbdGVybXMubmFtZV0uaW5jbHVkZXMoZmlsdGVycy50ZXJtX2lkKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIGNoZWNrZWQ6IChcbiAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnkuaGFzT3duUHJvcGVydHkodGVybXMubmFtZSkgJiZcbiAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnlbdGVybXMubmFtZV0uaW5jbHVkZXMoZmlsdGVycy50ZXJtX2lkKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pKVxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHBvc3RzOiBwID0+ICh7XG4gICAgICAgICAgICB0aXRsZTogcC50aXRsZS5yZW5kZXJlZCxcbiAgICAgICAgICAgIGxpbms6IHAubGluayxcbiAgICAgICAgICAgIGV4Y2VycHQ6IHAuZXhjZXJwdC5yZW5kZXJlZFxuICAgICAgICAgIH0pXG4gICAgICAgIH07XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEluaXRpYWwgaGlzdG9yeSBhbmQgY3VycmVudCBoaXN0b3J5IG9mIHZpc2libGUgcG9zdHMuIFRoaXMgaXMgdXNlZFxuICAgICAgICogdG8gY29uZmlndXJlIGhvdyB0aGUgVVJMIG9mIHRoZSBwYWdlIGlzIHJld3JpdHRlbi4gSXQgY2FuIGluY2x1ZGVcbiAgICAgICAqIHBhcmFtZXRlcnMgdG8gb21pdCBhbmQgYSBtYXBwaW5nIG9iamVjdCB0aGF0IHdpbGwgY29udmVydCBXUCBRdWVyeSB2YXJzXG4gICAgICAgKiB2YXJzIHRvIFdQIFJFU1QgcXVlcnkgdmFycy4gVGhpcyBwcmV2ZW50cyBjb25mbGljdHMgd2l0aCB0aGUgb3JpZ2luYWxcbiAgICAgICAqIFdQIFF1ZXJ5LlxuICAgICAgICpcbiAgICAgICAqIGZpbHRlclNhZmUgZGV0ZXJtaW5lcyB3ZXRoZXIgdG8gZmlsdGVyIHRoZSBzYWZlIHBhcmFtcyBmcm9tIHRoZSBoaXN0b3J5XG4gICAgICAgKiByZXBsYWNlU3RhdGUgbWV0aG9kLlxuICAgICAgICpcbiAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgKi9cbiAgICAgIGhpc3Rvcnk6IHtcbiAgICAgICAgb21pdDogW1xuICAgICAgICAgICdwYWdlJyxcbiAgICAgICAgICAncGVyX3BhZ2UnXG4gICAgICAgIF0sXG4gICAgICAgIG1hcDoge1xuICAgICAgICAgIC8vIGV4OyAnd29yZHByZXNzLXF1ZXJ5LXZhcic6ICd2dWUtYXBwLXF1ZXJ5LXZhcidcbiAgICAgICAgfSxcbiAgICAgICAgZmlsdGVyUGFyYW1zOiBmYWxzZVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBTdG9yYWdlIGZvciBhbGwgUG9zdCBjb250ZW50LCB0aGlzIGlzIHNldCB3aGVuIHBvc3RzIGFyZSBxdWVyaWVkLiBQb3N0XG4gICAgICAgKiBjb250ZW50IGlzIG9yZ2FuaXplZCBieSBwYWdlcy4gRWFjaCBwYWdlIGlzIGFuIG9iamVjdCB0aGF0IGluY2x1ZGVzIGFcbiAgICAgICAqIGhlYWRlcnMgb2JqZWN0LCBwb3N0cyBvYmplY3QgKGFjdHVhbCBjb250ZW50KSwgcXVlcnkgb2JqZWN0ICh0aGVcbiAgICAgICAqIG9yaWdpbmFsIHF1ZXJ5IGZvciB0aGUgcGFnZSksIGFuZCBzaG93IGJvb2xlYW4gdGhhdCBkZXRlcm1pbmVzIGlmIGl0XG4gICAgICAgKiBzaG91bGQgYmUgdmlzaWJsZS4gVGhlIGZpcnN0IHBhZ2Ugd2lsbCBhbHdheXMgYmUgdW5kZWZpbmVkLiBXaGVuIHRoZVxuICAgICAgICogcXVlcnkgaXMgbW9kaWZpZWQgYnkgc2VsZWN0aW5nIHRheG9ub21pZXMgdG8gZmlsdGVyIG9uLCB0aGlzIGVudGlyZVxuICAgICAgICogaGlzdG9yeSBpcyByZXdyaXR0ZW4uXG4gICAgICAgKlxuICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICovXG4gICAgICBwb3N0czogW1xuICAgICAgICAvLyB1bmRlZmluZWRcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgIGhlYWRlcnM6IHsgLi4uIH0sXG4gICAgICAgIC8vICAgcG9zdHM6IFsgLi4uIHBvc3QgY29udGVudCAuLi4gXSxcbiAgICAgICAgLy8gICBxdWVyeTogeyAuLi4gfSxcbiAgICAgICAgLy8gICBzaG93OiB0cnVlXG4gICAgICAgIC8vIH1cbiAgICAgIF0sXG4gICAgfSksXG4gICAgY29tcHV0ZWQ6IHtcbiAgICAgIC8qKlxuICAgICAgICogV2V0aGVyIHRoZXJlIGFyZSBubyBwb3N0cyB0byBzaG93IGJ1dCBhIHF1ZXJ5IGlzIGJlaW5nIG1hZGVcbiAgICAgICAqXG4gICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAqL1xuICAgICAgbG9hZGluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghdGhpcy5wb3N0cy5sZW5ndGgpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBsZXQgcGFnZSA9IHRoaXMucG9zdHNbdGhpcy5xdWVyeS5wYWdlXTtcblxuICAgICAgICByZXR1cm4gdGhpcy5pbml0ICYmICFwYWdlLnBvc3RzLmxlbmd0aCAmJiBwYWdlLnNob3c7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFdldGhlciB0aGVyZSBwb3N0cyB0byBkaXNwbGF5IGZyb20gdGhlIG1vZGlmaWVkIHF1ZXJ5XG4gICAgICAgKlxuICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgKi9cbiAgICAgIG5vbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuaGVhZGVycy5wYWdlcyAmJiAhdGhpcy5oZWFkZXJzLnRvdGFsO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBXZXRoZXIgdGhlcmUgaXMgYW5vdGhlciBwYWdlIG9yIG5vdFxuICAgICAgICpcbiAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICovXG4gICAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IG51bWJlciA9IHRoaXMucXVlcnkucGFnZTtcbiAgICAgICAgbGV0IHRvdGFsID0gdGhpcy5oZWFkZXJzLnBhZ2VzO1xuXG4gICAgICAgIGlmICghdGhpcy5wb3N0cy5sZW5ndGgpIHJldHVybiBmYWxzZTtcblxuICAgICAgICBsZXQgcGFnZSA9IHRoaXMucG9zdHNbbnVtYmVyXTtcblxuICAgICAgICByZXR1cm4gKG51bWJlciA8IHRvdGFsKSAmJiAocGFnZS5wb3N0cy5sZW5ndGggJiYgcGFnZS5zaG93KTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogV2V0aGVyIHRoZXJlIGlzIGEgcHJldmlvdXMgcGFnZSBvciBub3RcbiAgICAgICAqXG4gICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAqL1xuICAgICAgcHJldmlvdXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMucXVlcnkucGFnZSA+IDEpO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBXZXRoZXIgcG9zdHMgYXJlIGN1cnJlbnRseSBiZWluZyBmaWx0ZXJlZFxuICAgICAgICpcbiAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICovXG4gICAgICBmaWx0ZXJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIXRoaXMuaW5pdCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHJldHVybiAodGhpcy50ZXJtcy5maW5kKHQgPT4gdC5hY3RpdmUpKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIGxhbmd1YWdlIG9mIHRoZSBkb2N1bWVudCAoYW5kIHF1ZXJ5KVxuICAgICAgICpcbiAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgKi9cbiAgICAgIGxhbmc6ICgpID0+IHtcbiAgICAgICAgbGV0IGxhbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJykubGFuZztcblxuICAgICAgICByZXR1cm4gKGxhbmcgIT09ICdlbicpID8ge1xuICAgICAgICAgIGNvZGU6IGxhbmcsXG4gICAgICAgICAgcGF0aDogYC8ke2xhbmd9YFxuICAgICAgICB9IDoge1xuICAgICAgICAgIGNvZGU6ICdlbicsXG4gICAgICAgICAgcGF0aDogJydcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG1ldGhvZHM6IHtcbiAgICAgIC8qKlxuICAgICAgICogQ29udmVydHMgYSBKU09OIG9iamVjdCB0byBVUkwgUXVlcnkuIE9wcG9zaXRlIG9mIGJ1aWxkSnNvblF1ZXJ5LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge09iamVjdH0gcXVlcnkgIFVSTCBRdWVyeSBzdHJ1Y3R1cmVkIGFzIEpTT04gT2JqZWN0LlxuICAgICAgICogQHBhcmFtICB7QXJyYXl9ICBvbWl0ICAgU2V0IG9mIHBhcmFtcyBhcyBmbGFncyB0byBub3QgaW5jbHVkZSBpblxuICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHJldHVybmVkIHF1ZXJ5IHN0cmluZy5cbiAgICAgICAqIEBwYXJhbSAge09iamVjdH0gcmV2ICAgIFNldCBvZiBwYXJhbWV0ZXIgbWFwcyB0byByZXBsYWNlIHByb3ZpZGVkXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbSBuYW1lcyBpbiB0aGUgcXVlcnkuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgVGhlIHF1ZXJ5IHN0cmluZy5cbiAgICAgICAqL1xuICAgICAgYnVpbGRVcmxRdWVyeTogZnVuY3Rpb24ocXVlcnksIG9taXQgPSBmYWxzZSwgcmV2ID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHEgPSBPYmplY3Qua2V5cyhxdWVyeSlcbiAgICAgICAgICAubWFwKGsgPT4ge1xuICAgICAgICAgICAgaWYgKG9taXQgJiYgb21pdC5pbmNsdWRlcyhrKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICBsZXQgbWFwID0gKHJldiAmJiByZXYuaGFzT3duUHJvcGVydHkoaykpID8gcmV2W2tdIDogaztcblxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocXVlcnlba10pKVxuICAgICAgICAgICAgICByZXR1cm4gcXVlcnlba10ubWFwKGEgPT4gYCR7bWFwfVtdPSR7YX1gKS5qb2luKCcmJyk7XG4gICAgICAgICAgICByZXR1cm4gYCR7bWFwfT0ke3F1ZXJ5W2tdfWA7XG4gICAgICAgICAgfSkuZmlsdGVyKGsgPT4gKGspKS5qb2luKCcmJyk7XG5cbiAgICAgICAgcmV0dXJuIChxICE9PSAnJykgPyAnPycgKyBxIDogJyc7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIENvbnZlcnRzIGEgVVJMIFF1ZXJ5IFN0cmluZyB0byBhIEpTT04gT2JqZWN0LiBPcHBvc2l0ZSBvZiBidWlsZFVybFF1ZXJ5LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gcXVlcnkgIFVSTCBRdWVyeSBTdHJpbmcuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgIFVSTCBRdWVyeSBzdHJ1Y3R1cmVkIGFzIEpTT04gT2JqZWN0LlxuICAgICAgICovXG4gICAgICBidWlsZEpzb25RdWVyeTogZnVuY3Rpb24ocXVlcnkpIHtcbiAgICAgICAgaWYgKHF1ZXJ5ID09PSAnJykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGxldCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHF1ZXJ5KTtcbiAgICAgICAgbGV0IHEgPSB7fTtcblxuICAgICAgICAvLyBTZXQga2V5cyBpbiBvYmplY3QgYW5kIGdldCB2YWx1ZXMsIGNvbnZlcnQgdG8gbnVtYmVyICghTmFOKVxuICAgICAgICBwYXJhbXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgbGV0IGsgPSBrZXkucmVwbGFjZSgnW10nLCAnJyk7XG5cbiAgICAgICAgICBpZiAoIXEuaGFzT3duUHJvcGVydHkoaykpXG4gICAgICAgICAgICBxW2tdID0gcGFyYW1zLmdldEFsbChrZXkpLm1hcCh2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiAoaXNOYU4odmFsdWUpKSA/IHZhbHVlIDogK3ZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFJldmVyc2UgbWFwIHRoZSBwYXJhbWV0ZXJzIHRvIHRoZSBhY3R1YWwgcXVlcnkgdmFyc1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmhpc3RvcnkubWFwKS5tYXAoa2V5ID0+IHtcbiAgICAgICAgICBpZiAocS5oYXNPd25Qcm9wZXJ0eSh0aGlzLmhpc3RvcnkubWFwW2tleV0pKSB7XG4gICAgICAgICAgICBxW2tleV0gPSBxW3RoaXMuaGlzdG9yeS5tYXBba2V5XV07XG4gICAgICAgICAgICBkZWxldGUgcVt0aGlzLmhpc3RvcnkubWFwW2tleV1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHE7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFNldCB0aGUgVVJMIFF1ZXJ5XG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBxdWVyeSAgVVJMIFF1ZXJ5IHN0cnVjdHVyZWQgYXMgSlNPTiBPYmplY3QuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgVnVlIGluc3RhbmNlXG4gICAgICAgKi9cbiAgICAgIHJlcGxhY2VTdGF0ZTogZnVuY3Rpb24ocXVlcnkpIHtcbiAgICAgICAgbGV0IGhpc3RvcnkgPSB7fTtcblxuICAgICAgICAvLyBGaWx0ZXIgc2FmZSBwYXJhbXMgZm9yIHRoZSBoaXN0b3J5IHF1ZXJ5XG4gICAgICAgIGlmICh0aGlzLmhpc3RvcnkuZmlsdGVyUGFyYW1zKSB7XG4gICAgICAgICAgT2JqZWN0LmtleXMocXVlcnkpLm1hcChwID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtcy5pbmNsdWRlcyhwKSkge1xuICAgICAgICAgICAgICBoaXN0b3J5W3BdID0gcXVlcnlbcF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGlzdG9yeSA9IHF1ZXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5idWlsZFVybFF1ZXJ5KGhpc3RvcnksIHRoaXMuaGlzdG9yeS5vbWl0LCB0aGlzLmhpc3RvcnkubWFwKTtcblxuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgbnVsbCwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgc3RhdGUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBCYXNpYyBmZXRjaCBmb3IgcmV0cmlldmluZyBkYXRhIGZyb20gYW4gZW5kcG9pbnQgY29uZmlndXJlZCBpbiB0aGVcbiAgICAgICAqIGRhdGEuZW5kcG9pbnRzIHByb3BlcnR5LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge09iamVjdH0gIGRhdGEgIEEga2V5IHJlcHJlc2VudGluZyBhbiBlbmRwb2ludCBjb25maWd1cmVkIGluXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZGF0YS5lbmRwb2ludHMgcHJvcGVydHkuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgVGhlIGZldGNoIHJlcXVlc3QgZm9yIHRoYXQgZW5kcG9pbnQuXG4gICAgICAgKi9cbiAgICAgIGZldGNoOiBmdW5jdGlvbihkYXRhID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKCFkYXRhKSByZXR1cm4gZGF0YTtcblxuICAgICAgICByZXR1cm4gKHRoaXNbZGF0YV0ubGVuZ3RoKSA/IHRoaXNbZGF0YV0gOlxuICAgICAgICAgIGZldGNoKGAke3RoaXMuZG9tYWlufSR7dGhpcy5sYW5nLnBhdGh9JHt0aGlzLmVuZHBvaW50c1tkYXRhXX1gKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oZCA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuJHNldCh0aGlzLCBkYXRhLCBkLm1hcCh0aGlzLm1hcHMoKVtkYXRhXSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBjbGljayBldmVudCB0byBiZWdpbiBmaWx0ZXJpbmcuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBldmVudCAgVGhlIGNsaWNrIGV2ZW50IG9uIHRoZSBlbGVtZW50IHRoYXQgdHJpZ2dlcnNcbiAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBmaWx0ZXIuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgVnVlIGluc3RhbmNlXG4gICAgICAgKi9cbiAgICAgIGNsaWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBsZXQgdGF4b25vbXkgPSBldmVudC5kYXRhLnBhcmVudDtcbiAgICAgICAgbGV0IHRlcm0gPSBldmVudC5kYXRhLmlkIHx8IGZhbHNlO1xuXG4gICAgICAgIGlmICh0ZXJtKSB7XG4gICAgICAgICAgdGhpcy5maWx0ZXIodGF4b25vbXksIHRlcm0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZmlsdGVyQWxsKHRheG9ub215KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgcmVzZXQgZXZlbnQgdG8gdG9nZ2xlIGFsbCBmaWx0ZXJzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge09iamVjdH0gZXZlbnQgIFRoZSBjbGljayBldmVudCBvbiB0aGUgZWxlbWVudCB0aGF0IHRyaWdnZXJzXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZmlsdGVyLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgIFZ1ZSBpbnN0YW5jZVxuICAgICAgICovXG4gICAgICB0b2dnbGU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGxldCB0YXhvbm9teSA9IGV2ZW50LmRhdGEucGFyZW50O1xuICAgICAgICB0aGlzLmZpbHRlckFsbCh0YXhvbm9teSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFNpbmdsZSBmaWx0ZXIgZnVuY3Rpb24uIElmIHRoZSBmaWx0ZXIgaXMgYWxyZWFkeSBwcmVzZW50IGluIHRoZSBxdWVyeVxuICAgICAgICogaXQgd2lsbCBhZGQgdGhlIGZpbHRlciB0byB0aGUgcXVlcnkuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSB0YXhvbm9teSAgVGhlIHRheG9ub215IHNsdWcgb2YgdGhlIGZpbHRlclxuICAgICAgICogQHBhcmFtICB7TnVtYmVyfSB0ZXJtICAgICAgVGhlIGlkIG9mIHRoZSB0ZXJtIHRvIGZpbHRlciBvblxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgIFZ1ZSBpbnN0YW5jZVxuICAgICAgICovXG4gICAgICBmaWx0ZXI6IGZ1bmN0aW9uKHRheG9ub215LCB0ZXJtKSB7XG4gICAgICAgIGxldCB0ZXJtcyA9ICh0aGlzLnF1ZXJ5Lmhhc093blByb3BlcnR5KHRheG9ub215KSkgP1xuICAgICAgICAgIHRoaXMucXVlcnlbdGF4b25vbXldIDogW3Rlcm1dOyAvLyBnZXQgb3RoZXIgcXVlcnkgb3IgaW5pdGlhbGl6ZS5cblxuICAgICAgICAvLyBUb2dnbGUsIGlmIHRoZSB0YXhvbm9teSBleGlzdHMsIGZpbHRlciBpdCBvdXQsIG90aGVyd2lzZSBhZGQgaXQuXG4gICAgICAgIGlmICh0aGlzLnF1ZXJ5Lmhhc093blByb3BlcnR5KHRheG9ub215KSlcbiAgICAgICAgICB0ZXJtcyA9ICh0ZXJtcy5pbmNsdWRlcyh0ZXJtKSkgP1xuICAgICAgICAgICAgdGVybXMuZmlsdGVyKGVsID0+IGVsICE9PSB0ZXJtKSA6IHRlcm1zLmNvbmNhdChbdGVybV0pO1xuXG4gICAgICAgIHRoaXMudXBkYXRlUXVlcnkodGF4b25vbXksIHRlcm1zKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQSBjb250cm9sIGZvciBmaWx0ZXJpbmcgYWxsIG9mIHRoZSB0ZXJtcyBpbiBhIHBhcnRpY3VsYXIgdGF4b25vbXkgb25cbiAgICAgICAqIG9yIG9mZi5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRheG9ub215ICBUaGUgdGF4b25vbXkgc2x1ZyBvZiB0aGUgZmlsdGVyXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgVnVlIGluc3RhbmNlXG4gICAgICAgKi9cbiAgICAgIGZpbHRlckFsbDogZnVuY3Rpb24odGF4b25vbXkpIHtcbiAgICAgICAgbGV0IHRheCA9IHRoaXMudGVybXMuZmluZCh0ID0+IHQuc2x1ZyA9PT0gdGF4b25vbXkpO1xuICAgICAgICBsZXQgY2hlY2tlZCA9ICEodGF4LmNoZWNrZWQpO1xuXG4gICAgICAgIHRoaXMuJHNldCh0YXgsICdjaGVja2VkJywgY2hlY2tlZCk7XG5cbiAgICAgICAgbGV0IHRlcm1zID0gdGF4LmZpbHRlcnMubWFwKHRlcm0gPT4ge1xuICAgICAgICAgICAgdGhpcy4kc2V0KHRlcm0sICdjaGVja2VkJywgY2hlY2tlZCk7XG4gICAgICAgICAgICByZXR1cm4gdGVybS5pZDtcbiAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVF1ZXJ5KHRheG9ub215LCAoY2hlY2tlZCkgPyB0ZXJtcyA6IFtdKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhpcyB1cGRhdGVzIHRoZSBxdWVyeSBwcm9wZXJ0eSB3aXRoIHRoZSBuZXcgZmlsdGVycy5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICB0YXhvbm9teSAgVGhlIHRheG9ub215IHNsdWcgb2YgdGhlIGZpbHRlclxuICAgICAgICogQHBhcmFtICB7QXJyYXl9ICAgdGVybXMgICAgIEFycmF5IG9mIHRlcm0gaWRzXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgIFJlc29sdmVzIHdoZW4gdGhlIHRlcm1zIGFyZSB1cGRhdGVkXG4gICAgICAgKi9cbiAgICAgIHVwZGF0ZVF1ZXJ5OiBmdW5jdGlvbih0YXhvbm9teSwgdGVybXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiAgICAgICAgICB0aGlzLiRzZXQodGhpcy5xdWVyeSwgdGF4b25vbXksIHRlcm1zKTtcbiAgICAgICAgICB0aGlzLiRzZXQodGhpcy5xdWVyeSwgJ3BhZ2UnLCAxKTtcblxuICAgICAgICAgIC8vIGhpZGUgYWxsIG9mIHRoZSBwb3N0c1xuICAgICAgICAgIHRoaXMucG9zdHMubWFwKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkgdGhpcy4kc2V0KHRoaXMucG9zdHNbaW5kZXhdLCAnc2hvdycsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4odGhpcy53cClcbiAgICAgICAgLmNhdGNoKG1lc3NhZ2UgPT4ge1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICAgICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKG1lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEEgZnVuY3Rpb24gdG8gcmVzZXQgdGhlIGZpbHRlcnMgdG8gXCJBbGwgUG9zdHMuXCJcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtPYmplY3R9ICBldmVudCAgVGhlIHRheG9ub215IHNsdWcgb2YgdGhlIGZpbHRlclxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICBSZXNvbHZlcyBhZnRlciByZXNldHRpbmcgdGhlIGZpbHRlclxuICAgICAgICovXG4gICAgICByZXNldDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4geyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4gICAgICAgICAgbGV0IHRheG9ub215ID0gZXZlbnQuZGF0YS5zbHVnO1xuICAgICAgICAgIGlmICh0aGlzLnF1ZXJ5Lmhhc093blByb3BlcnR5KHRheG9ub215KSkge1xuICAgICAgICAgICAgdGhpcy4kc2V0KHRoaXMucXVlcnksIHRheG9ub215LCBbXSk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQSBmdW5jdGlvbiB0byBwYWdpbmF0ZSB1cCBvciBkb3duIGEgcG9zdCdzIGxpc3QgYmFzZWQgb24gdGhlIGNoYW5nZSBhbW91bnRcbiAgICAgICAqIGFzc2lnbmVkIHRvIHRoZSBjbGlja2VkIGVsZW1lbnQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7T2JqZWN0fSAgZXZlbnQgIFRoZSBjbGljayBldmVudCBvZiB0aGUgcGFnaW5hdGlvbiBlbGVtZW50XG4gICAgICAgKlxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgIFJlc29sdmVzIGFmdGVyIHVwZGF0aW5nIHRoZSBwYWdpbmF0aW9uIGluIHRoZVxuICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5XG4gICAgICAgKi9cbiAgICAgIHBhZ2luYXRlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIC8vIFRoZSBjaGFuZ2UgaXMgdGhlIG5leHQgcGFnZSBhcyB3ZWxsIGFzIGFuIGluZGljYXRpb24gb2Ygd2hhdFxuICAgICAgICAvLyBkaXJlY3Rpb24gd2UgYXJlIG1vdmluZyBpbiBmb3IgdGhlIHF1ZXVlLlxuICAgICAgICBsZXQgY2hhbmdlID0gcGFyc2VJbnQoZXZlbnQudGFyZ2V0LmRhdGFzZXQuYW1vdW50KTtcbiAgICAgICAgbGV0IHBhZ2UgPSB0aGlzLnF1ZXJ5LnBhZ2UgKyBjaGFuZ2U7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4geyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4gICAgICAgICAgdGhpcy4kc2V0KHRoaXMucXVlcnksICdwYWdlJywgcGFnZSk7XG4gICAgICAgICAgdGhpcy4kc2V0KHRoaXMucG9zdHNbdGhpcy5xdWVyeS5wYWdlXSwgJ3Nob3cnLCB0cnVlKTtcblxuICAgICAgICAgIHRoaXMucXVldWUoWzAsIGNoYW5nZV0pO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFdyYXBwZXIgZm9yIHRoZSBxdWV1ZSBwcm9taXNlXG4gICAgICAgKlxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gUmV0dXJucyB0aGUgcXVldWUgZnVuY3Rpb24uXG4gICAgICAgKi9cbiAgICAgIHdwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVldWUoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhpcyBxdWV1ZXMgdGhlIGN1cnJlbnQgcG9zdCByZXF1ZXN0IGFuZCB0aGUgbmV4dCByZXF1ZXN0IGJhc2VkIG9uIHRoZVxuICAgICAgICogZGlyZWN0aW9uIG9mIHBhZ2luYXRpb24uIEl0IHVzZXMgYW4gQXN5bmMgbWV0aG9kIHRvIHJldHJpZXZlIHRoZVxuICAgICAgICogcmVxdWVzdHMgaW4gb3JkZXIgc28gdGhhdCB3ZSBjYW4gZGV0ZXJtaW5lIGlmIHRoZXJlIGFyZSBtb3JlIHBvc3RzIHRvXG4gICAgICAgKiBzaG93IGFmdGVyIHRoZSByZXF1ZXN0IGZvciB0aGUgY3VycmVudCB2aWV3LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge0FycmF5fSAgcXVlcmllcyAgVGhlIGFtb3VudCBvZiBxdWVyaWVzIHRvIG1ha2UgYW5kIHdoaWNoXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbiB0byBtYWtlIHRoZW0gaW4uIDAgbWVhbnMgdGhlXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgcGFnZSwgMSBtZWFucyB0aGUgbmV4dCBwYWdlLiAtMVxuICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICB3b3VsZCBtZWFuIHRoZSBwcmV2aW91cyBwYWdlLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgVnVlIGluc3RhbmNlLlxuICAgICAgICovXG4gICAgICBxdWV1ZTogZnVuY3Rpb24ocXVlcmllcyA9IFswLCAxXSkge1xuICAgICAgICAvLyBTZXQgYSBiZW5jaG1hcmsgcXVlcnkgdG8gY29tcGFyZSB0aGUgdXBjb21taW5nIHF1ZXJ5IHRvLlxuICAgICAgICBsZXQgT2JqMSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucXVlcnkpOyAvLyBjcmVhdGUgY29weSBvZiBvYmplY3QuXG4gICAgICAgIGRlbGV0ZSBPYmoxLnBhZ2U7IC8vIGRlbGV0ZSB0aGUgcGFnZSBhdHRyaWJ1dGUgYmVjYXVzZSBpdCB3aWxsIGJlIGRpZmZlcmVudC5cbiAgICAgICAgT2JqZWN0LmZyZWV6ZShPYmoxKTsgLy8gcHJldmVudCBjaGFuZ2VzIHRvIG91ciBjb21wYXJpc29uLlxuXG4gICAgICAgIC8vIFRoZSBmdW5jdGlvbiBpcyBhc3luYyBiZWNhdXNlIHdlIHdhbnQgdG8gd2FpdCB1bnRpbCBlYWNoIHByb21pc2VcbiAgICAgICAgLy8gaXMgcXVlcnkgaXMgZmluaXNoZWQgYmVmb3JlIHdlIHJ1biB0aGUgbmV4dC4gV2UgZG9uJ3Qgd2FudCB0byBib3RoZXJcbiAgICAgICAgLy8gc2VuZGluZyBhIHJlcXVlc3QgaWYgdGhlcmUgYXJlIG5vIHByZXZpb3VzIG9yIG5leHQgcGFnZXMuIFRoZSB3YXkgd2VcbiAgICAgICAgLy8gZmluZCBvdXQgaWYgdGhlcmUgYXJlIHByZXZpb3VzIG9yIG5leHQgcGFnZXMgcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnRcbiAgICAgICAgLy8gcGFnZSBxdWVyeSBpcyB0aHJvdWdoIHRoZSBoZWFkZXJzIG9mIHRoZSByZXNwb25zZSBwcm92aWRlZCBieSB0aGVcbiAgICAgICAgLy8gV1AgUkVTVCBBUEkuXG4gICAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcXVlcnkgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnF1ZXJ5KTtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICAgICAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHJlc29sdmUoKSk7XG4gICAgICAgICAgICBsZXQgcGFnZXMgPSB0aGlzLmhlYWRlcnMucGFnZXM7XG4gICAgICAgICAgICBsZXQgcGFnZSA9IHRoaXMucXVlcnkucGFnZTtcbiAgICAgICAgICAgIGxldCBjdXJyZW50ID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgbmV4dCA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IHByZXZpb3VzID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIEJ1aWxkIHRoZSBxdWVyeSBhbmQgc2V0IGl0cyBwYWdlIG51bWJlci5cbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShxdWVyeSwgJ3BhZ2UnLCB7XG4gICAgICAgICAgICAgIHZhbHVlOiBwYWdlICsgcXVlcmllc1tpXSxcbiAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFRoZXJlIHdpbGwgbmV2ZXIgYmUgYSBwYWdlIDAgb3IgYmVsb3csIHNvIHNraXAgdGhpcyBxdWVyeS5cbiAgICAgICAgICAgIGlmIChxdWVyeS5wYWdlIDw9IDApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgd2UgaGF2ZSB0aGUgcGFnZSB0aGF0IHdlIGFyZSBnb2luZyB0byBxdWV1ZWRcbiAgICAgICAgICAgIC8vIGFuZCB0aGUgcXVlcnkgc3RydWN0dXJlIG9mIHRoYXQgcGFnZSBtYXRjaGVzIHRoZSBjdXJyZW50IHF1ZXJ5XG4gICAgICAgICAgICAvLyBzdHJ1Y3R1cmUgKG90aGVyIHRoYW4gdGhlIHBhZ2UsIHdoaWNoIHdpbGwgb2J2aW91c2x5IGJlXG4gICAgICAgICAgICAvLyBkaWZmZXJlbnQpLiBUaGlzIHdpbGwgaGVscCB1cyBkZXRlcm1pbmUgaWYgd2UgbmVlZCB0byBtYWtlIGEgbmV3XG4gICAgICAgICAgICAvLyByZXF1ZXN0LlxuICAgICAgICAgICAgbGV0IGhhdmVQYWdlID0gKHRoaXMucG9zdHNbcXVlcnkucGFnZV0pID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgbGV0IHBhZ2VRdWVyeU1hdGNoZXMgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGhhdmVQYWdlKSB7XG4gICAgICAgICAgICAgIGxldCBPYmoyID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wb3N0c1txdWVyeS5wYWdlXS5xdWVyeSk7XG4gICAgICAgICAgICAgIGRlbGV0ZSBPYmoyLnBhZ2U7XG4gICAgICAgICAgICAgIHBhZ2VRdWVyeU1hdGNoZXMgPSAoSlNPTi5zdHJpbmdpZnkoT2JqMSkgPT09IEpTT04uc3RyaW5naWZ5KE9iajIpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGhhdmVQYWdlICYmIHBhZ2VRdWVyeU1hdGNoZXMpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSBjdXJyZW50IHBhZ2Ugd2Ugd2FudCB0aGUgcXVlcnkgdG8gZ28gdGhyb3VnaC5cbiAgICAgICAgICAgIGN1cnJlbnQgPSAocXVlcnkucGFnZSA9PT0gcGFnZSk7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIGEgbmV4dCBvciBwcmV2aW91cyBwYWdlLCB3ZSdsbCBwcmVmZXRjaCB0aGVtLlxuICAgICAgICAgICAgLy8gV2UnbGwga25vdyB0aGVyZSdzIGEgbmV4dCBvciBwcmV2aW91cyBwYWdlIGJhc2VkIG9uIHRoZVxuICAgICAgICAgICAgLy8gaGVhZGVycyBzZW50IGJ5IHRoZSBjdXJyZW50IHBhZ2UgcXVlcnkuXG4gICAgICAgICAgICBuZXh0ID0gKHBhZ2UgPCBwYWdlcyAmJiBxdWVyeS5wYWdlID4gcGFnZSk7XG4gICAgICAgICAgICBwcmV2aW91cyA9IChwYWdlID4gMSAmJiBxdWVyeS5wYWdlIDwgcGFnZSk7XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50IHx8IG5leHQgfHwgcHJldmlvdXMpXG4gICAgICAgICAgICAgIGF3YWl0IHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMud3BRdWVyeShxdWVyeSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC50aGVuKHRoaXMucmVzcG9uc2UpXG4gICAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBoZWFkZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5oZWFkZXJzKTtcblxuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgdGhlIGN1cnJlbnQgcGFnZSwgcmVwbGFjZSB0aGUgYnJvd3NlciBoaXN0b3J5IHN0YXRlLlxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50KSB0aGlzLnJlcGxhY2VTdGF0ZShxdWVyeSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3MoZGF0YSwgcXVlcnksIGhlYWRlcnMpO1xuICAgICAgICAgICAgICB9KS5jYXRjaCh0aGlzLmVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEJ1aWxkcyB0aGUgVVJMIHF1ZXJ5IGZyb20gdGhlIHByb3ZpZGVkIHF1ZXJ5IHByb3BlcnR5LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge09iamVjdH0gIHF1ZXJ5ICBBIFdvcmRQcmVzcyBxdWVyeSB3cml0dGVuIGluIEpTT04gZm9ybWF0XG4gICAgICAgKlxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgIFRoZSBmZXRjaCByZXF1ZXN0IGZvciB0aGUgcXVlcnlcbiAgICAgICAqL1xuICAgICAgd3BRdWVyeTogZnVuY3Rpb24ocXVlcnkpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgc2FmZSBXUCBRdWVyeSB1c2luZyBwZXJtaXR0ZWQgcGFyYW1zXG4gICAgICAgIGxldCB3cFF1ZXJ5ID0ge307XG5cbiAgICAgICAgT2JqZWN0LmtleXMocXVlcnkpLm1hcChwID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5wYXJhbXMuaW5jbHVkZXMocCkpXG4gICAgICAgICAgICB3cFF1ZXJ5W3BdID0gcXVlcnlbcF07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEJ1aWxkIHRoZSB1cmwgcXVlcnkuXG4gICAgICAgIGxldCB1cmwgPSBbXG4gICAgICAgICAgdGhpcy5kb21haW4sXG4gICAgICAgICAgdGhpcy5sYW5nLnBhdGgsXG4gICAgICAgICAgdGhpcy5lbmRwb2ludHNbdGhpcy50eXBlXSxcbiAgICAgICAgICB0aGlzLmJ1aWxkVXJsUXVlcnkod3BRdWVyeSlcbiAgICAgICAgXS5qb2luKCcnKTtcblxuICAgICAgICAvLyBTZXQgcG9zdHMgYW5kIHN0b3JlIGEgY29weSBvZiB0aGUgcXVlcnkgZm9yIHJlZmVyZW5jZS5cbiAgICAgICAgdGhpcy4kc2V0KHRoaXMucG9zdHMsIHF1ZXJ5LnBhZ2UsIHtcbiAgICAgICAgICBwb3N0czogW10sXG4gICAgICAgICAgcXVlcnk6IE9iamVjdC5mcmVlemUocXVlcnkpLFxuICAgICAgICAgIHNob3c6ICh0aGlzLnF1ZXJ5LnBhZ2UgPj0gcXVlcnkucGFnZSlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEhhbmRsZXMgdGhlIHJlc3BvbnNlLCBzZXR0aW5nIHRoZSBoZWFkZXJzIG9mIHRoZSBxdWVyeSBhbmQgcmV0dXJuaW5nXG4gICAgICAgKiB0aGUgcmVzcG9uc2UgYXMgSlNPTi5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSByZXNwb25zZSBvYmplY3QgYXMgSlNPTlxuICAgICAgICovXG4gICAgICByZXNwb25zZTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgbGV0IGhlYWRlcnMgPSB7XG4gICAgICAgICAgdG90YWw6ICdYLVdQLVRvdGFsJyxcbiAgICAgICAgICBwYWdlczogJ1gtV1AtVG90YWxQYWdlcycsXG4gICAgICAgICAgbGluazogJ0xpbmsnXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhoZWFkZXJzKTtcblxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGhlYWRlciA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KGhlYWRlcnNba2V5c1tpXV0pO1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gKGlzTmFOKGhlYWRlcikpID8gaGVhZGVyIDogKHBhcnNlSW50KGhlYWRlcikgfHwgMCk7XG4gICAgICAgICAgICBoZWFkZXJzW2tleXNbaV1dID0gdmFsdWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy4kc2V0KHRoaXMsICdoZWFkZXJzJywgaGVhZGVycyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBQcm9jZXNzZXMgdGhlIHBvc3RzIGFuZCBtYXBzIHRoZSBkYXRhIHRvIGRhdGEgbWFwcyBwcm92aWRlZCBieSB0aGVcbiAgICAgICAqIGRhdGEubWFwcyBwcm9wZXJ0eS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAgICAgVGhlIHBvc3QgZGF0YSByZXRyaWV2ZWQgZnJvbSB0aGUgV1AgUkVTVCBBUElcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeSAgICBUaGUgdGhlIHF1ZXJ5IHVzZWQgdG8gZ2V0IHRoZSBkYXRhXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gaGVhZGVycyAgVGhlIHRoZSBoZWFkZXJzIG9mIHRoZSByZXF1ZXN0XG4gICAgICAgKi9cbiAgICAgIHByb2Nlc3M6IGZ1bmN0aW9uKGRhdGEsIHF1ZXJ5LCBoZWFkZXJzKSB7XG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBwb3N0cyBmb3IgdGhpcyBxdWVyeSwgbWFwIHRoZW0gdG8gdGhlIHRlbXBsYXRlLlxuICAgICAgICBsZXQgcG9zdHMgPSAoQXJyYXkuaXNBcnJheShkYXRhKSkgP1xuICAgICAgICAgIGRhdGEubWFwKHRoaXMubWFwcygpW3RoaXMudHlwZV0pIDogZmFsc2U7XG5cbiAgICAgICAgLy8gU2V0IHBvc3RzIGFuZCBzdG9yZSBhIGNvcHkgb2YgdGhlIHF1ZXJ5IGZvciByZWZlcmVuY2UuXG4gICAgICAgIHRoaXMuJHNldCh0aGlzLnBvc3RzW3F1ZXJ5LnBhZ2VdLCAncG9zdHMnLCBwb3N0cyk7XG4gICAgICAgIHRoaXMuJHNldCh0aGlzLnBvc3RzW3F1ZXJ5LnBhZ2VdLCAnaGVhZGVycycsIE9iamVjdC5mcmVlemUoaGVhZGVycykpO1xuXG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBwb3N0cywgcGFzcyBhbG9uZyB0byB0aGUgZXJyb3IgaGFuZGxlci5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKVxuICAgICAgICAgIHRoaXMuZXJyb3Ioe2Vycm9yOiBkYXRhLCBxdWVyeTogcXVlcnl9KTtcblxuICAgICAgICB0aGlzLiRzZXQodGhpcywgJ2luaXQnLCB0cnVlKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogRXJyb3IgcmVzcG9uc2UgdGhyb3duIHdoZW4gdGhlcmUgaXMgYW4gZXJyb3IgaW4gdGhlIFdQIFJFU1QgQVAgcmVxdWVzdC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgIFRoZSBlcnJvciByZXNwb25zZVxuICAgICAgICovXG4gICAgICBlcnJvcjogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gICAgICAgIGlmIChcImRldmVsb3BtZW50XCIgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICAgICAgICBjb25zb2xlLmRpcihyZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQ29udmVydCB0aGUgY3VycmVudCBRdWVyeSBvciBhIHBhc3NlZCBxdWVyeSB0byBKUyByZWFkYWJsZSBmb3JtYXRcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHF1ZXJ5ICBBbiBleGlzdGluZyBxdWVyeSB0byBwYXJzZVxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICBRdWVyeSBhcyBhIEpTT04gb2JqZWN0XG4gICAgICAgKi9cbiAgICAgIGdldFN0YXRlOiBmdW5jdGlvbihxdWVyeSA9IGZhbHNlKSB7XG4gICAgICAgIHF1ZXJ5ID0gKHF1ZXJ5KSA/IHF1ZXJ5IDogdGhpcy5idWlsZEpzb25RdWVyeSh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcblxuICAgICAgICBPYmplY3Qua2V5cyhxdWVyeSkubWFwKGtleSA9PiB7XG4gICAgICAgICAgdGhpcy4kc2V0KHRoaXMucXVlcnksIGtleSwgcXVlcnlba2V5XSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuPC9zY3JpcHQ+IiwiaW1wb3J0IEFyY2hpdmUgZnJvbSAnQG55Y29wcG9ydHVuaXR5L3dwLWFyY2hpdmUtdnVlL3NyYy9hcmNoaXZlLnZ1ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZXh0ZW5kczogQXJjaGl2ZSwgLy8gRXh0ZW5kIHRoZSBBcmNoaXZlIGFwcCBoZXJlXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgaXMgb3VyIGN1c3RvbSBwb3N0IHR5cGUgdG8gcXVlcnlcbiAgICAgICAqXG4gICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICovXG4gICAgICB0eXBlOiAncHJvZ3JhbXMnLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoaXMgaXMgdGhlIGVuZHBvaW50IGxpc3QgZm9yIHRlcm1zIGFuZCBwb3N0IHJlcXVlc3RzXG4gICAgICAgKlxuICAgICAgICogQHR5cGUgIHtPYmplY3R9XG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRlcm1zICAgICBBIHJlcXVpcmVkIGVuZHBvaW50IGZvciB0aGUgbGlzdCBvZiBmaWx0ZXJzXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvZ3JhbXMgIFRoaXMgaXMgYmFzZWQgb24gdGhlICd0eXBlJyBzZXR0aW5nIGFib3ZlXG4gICAgICAgKi9cbiAgICAgIGVuZHBvaW50czoge1xuICAgICAgICB0ZXJtczogJy9kYXRhL2ZpbHRlci5qc29uJyxcbiAgICAgICAgcHJvZ3JhbXM6ICcvZGF0YS9zZXJ2aWNlcy5qc29uJyxcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhpcyBpcyB0aGUgZG9tYWluIGZvciBvdXIgbG9jYWwgV29yZFByZXNzIGluc3RhbGxhdGlvbi5cbiAgICAgICAqXG4gICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICovXG4gICAgICBkb21haW46ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLFxuXG4gICAgICAvKipcbiAgICAgICAqIEVhY2ggZW5kcG9pbnQgYWJvdmUgd2lsbCBhY2Nlc3MgYSBtYXAgdG8gdGFrZSB0aGUgZGF0YSBmcm9tIHRoZSByZXF1ZXN0XG4gICAgICAgKiBhbmQgdHJhbnNmb3JtIGl0IGZvciB0aGUgYXBwJ3MgZGlzcGxheSBwdXJwb3Nlc1xuICAgICAgICpcbiAgICAgICAqIEB0eXBlICAge0Z1bmN0aW9ufVxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgT2JqZWN0IHdpdGggYSBtYXBwaW5nIGZ1bmN0aW9uIGZvciBlYWNoIGVuZHBvaW50XG4gICAgICAgKi9cbiAgICAgIG1hcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBwcm9nRml0ZXIgPSB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogUHJvZ3JhbXMgZW5kcG9pbnQgZGF0YSBtYXBcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBwcm9ncmFtczogKHApID0+IHAsXG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBUZXJtcyBlbmRwb2ludCBkYXRhIG1hcFxuICAgICAgICAgICAqL1xuICAgICAgICAgIHRlcm1zOiAodGVybXMpID0+ICh7XG4gICAgICAgICAgICBuYW1lOiB0ZXJtcy5uYW1lLFxuICAgICAgICAgICAgc2x1ZzogdGVybXMuc2x1ZyxcbiAgICAgICAgICAgIGZpbHRlcnM6IHRlcm1zLnByb2dyYW1zLm1hcCgoZmlsdGVycykgPT4gKHtcbiAgICAgICAgICAgICAgaWQ6IGZpbHRlcnMudGVybV9pZCxcbiAgICAgICAgICAgICAgbmFtZTogZmlsdGVycy5uYW1lLFxuICAgICAgICAgICAgICBzbHVnOiBmaWx0ZXJzLnNsdWcsXG4gICAgICAgICAgICAgIHBhcmVudDogdGVybXMubmFtZSxcbiAgICAgICAgICAgICAgYWN0aXZlOlxuICAgICAgICAgICAgICAgIHRoaXMucXVlcnkuaGFzT3duUHJvcGVydHkodGVybXMubmFtZSkgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXJ5W3Rlcm1zLm5hbWVdLmluY2x1ZGVzKGZpbHRlcnMudGVybV9pZCksXG4gICAgICAgICAgICAgIGNoZWNrZWQ6XG4gICAgICAgICAgICAgICAgdGhpcy5xdWVyeS5oYXNPd25Qcm9wZXJ0eSh0ZXJtcy5uYW1lKSAmJlxuICAgICAgICAgICAgICAgIHRoaXMucXVlcnlbdGVybXMubmFtZV0uaW5jbHVkZXMoZmlsdGVycy50ZXJtX2lkKSxcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc29sZS5sb2coJ3Byb2dGaXRlcjonLCBwcm9nRml0ZXIpO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgbWV0aG9kczoge1xuICAgIC8qKlxuICAgICAqIFByb3h5IGZvciB0aGUgY2xpY2sgZXZlbnQgdGhhdCB0b2dnbGVzIHRoZSBmaWx0ZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgdG9DaGFuZ2UgIEEgY29uc3RydWN0ZWQgb2JqZWN0IGNvbnRhaW5pbmc6XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudCAtIFRoZSBjbGljayBldmVudFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSAgLSBUaGUgdGVybSBvYmplY3RcbiAgICAgKlxuICAgICAqIEByZXR1cm4gIHtPYmplY3R9ICAgICAgICAgICAgVnVlIEluc3RhbmNlXG4gICAgICovXG4gICAgY2hhbmdlOiBmdW5jdGlvbih0b0NoYW5nZSkge1xuICAgICAgdGhpcy4kc2V0KHRvQ2hhbmdlLmRhdGEsICdjaGVja2VkJywgIXRvQ2hhbmdlLmRhdGEuY2hlY2tlZCk7XG5cbiAgICAgIHRoaXMuY2xpY2sodG9DaGFuZ2UpO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICB9LFxuXG4gIC8qKlxuICAgKiBUaGUgY3JlYXRlZCBob29rIHN0YXJ0cyB0aGUgYXBwbGljYXRpb25cbiAgICpcbiAgICogQHVybCBodHRwczovL3Z1ZWpzLm9yZy92Mi9hcGkvI2NyZWF0ZWRcbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XG4gICAgLy8gQWRkIGN1c3RvbSB0YXhvbm9teSBxdWVyaWVzIHRvIHRoZSBsaXN0IG9mIHNhZmUgcGFyYW1zXG4gICAgWydwcm9ncmFtcycsICdwb3B1bGF0aW9ucy1zZXJ2ZWQnXS5tYXAoKHApID0+IHtcbiAgICAgIHRoaXMucGFyYW1zLnB1c2gocCk7XG4gICAgfSk7XG5cbiAgICAvLyBJbml0aWFsaXplIHRoZSBhcHBsaWNhdGlvblxuICAgIHRoaXMuZ2V0U3RhdGUoKSAvLyBHZXQgd2luZG93LmxvY2F0aW9uLnNlYXJjaCAoZmlsdGVyIGhpc3RvcnkpXG4gICAgICAucXVldWUoKSAvLyBJbml0aWFsaXplIHRoZSBmaXJzdCBwYWdlIHJlcXVlc3RcbiAgICAgIC5mZXRjaCgndGVybXMnKSAvLyBHZXQgdGhlIHRlcm1zIGZyb20gdGhlICd0ZXJtcycgZW5kcG9pbnRcbiAgICAgIC5jYXRjaCh0aGlzLmVycm9yKTtcbiAgfSxcbn07XG4iXSwibmFtZXMiOlsiQXJjaGl2ZSJdLCJtYXBwaW5ncyI6Ijs7O0VBQ0U7Ozs7Ozs7Ozs7O0lBV0EsYUFBZTtNQUNiLEtBQUssRUFBRTtRQUNMLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNO09BQ3ZCO01BQ0QsSUFBSSxFQUFFLE9BQU87Ozs7OztRQU1YLElBQUksRUFBRSxLQUFLOzs7Ozs7O1FBT1gsSUFBSSxFQUFFLE9BQU87Ozs7Ozs7Ozs7UUFVYixLQUFLLEVBQUUsRUFBRTs7Ozs7Ozs7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
