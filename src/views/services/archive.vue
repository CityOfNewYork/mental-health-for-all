<template>
  <section class="o-container u-top-spacing-small desktop:flex">
    <div class='o-article-sidebar o-content-container--compact u-lg-gutter desktop:w-sidebar'>
      <div class='px-8 py-3'>
        <h3>Filter Services:</h3>
      </div>

      <div class='c-list-box c-list-box--quaternary js-accordion o-accordion'>
        <div v-for="term in terms" :key="term.term_id" class="c-list-box__item o-accordion__item">
          <button data-js="accordion" type="button" :aria-controls="'aria-c-' + term.slug" aria-expanded="true" :class="'c-list-box__heading o-accordion__header bg-' + term.slug + '--primary active'">
            {{term.name}}
            <svg class="o-accordion__caret icon" aria-hidden="true"><use xlink:href="#icon-caret-down"></use></svg>
          </button>

          <ul aria-hidden="false" :id="'aria-c-' + term.slug" class="active hidden">
            <li v-for="filter in term.filters" :key="filter.slug" :class="'c-list-box__subitem bg-' + term.slug + '--primary'">
            <!-- <li v-for="filter in term.filters" :key="filter.slug" :class="'c-list-box__subitem bg-gray-light text-black'"> -->
              <label class="checkbox">
                <input
                  class="checkbox__field"
                  type="checkbox"
                  :value="filter.slug"
                  :checked="filter.checked"
                  @change="change({ event: $event, data: filter })"
                />
                <svg class="checkbox__indicator"><use xlink:href="#icon-check"></use></svg>
                <span v-html="filter.name" class="select-none">{{ filter.name }}</span>
              </label>
            </li>

            <li :class="'c-list-box__subitem bg-' + term.slug + '--primary text-center'">
            <!-- <li :class="'c-list-box__subitem bg-gray-light text-black'"> -->
              <button class="button--outline p-3 w-full mb-4" @click="toggle({ event: $event, data: { parent: term.slug } })">
                Toggle All
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class='o-article desktop:w-article'>
      <section class="c-block-list">
        <!-- <div v-if="!loading">
          Results
        </div>

        <div v-if="none">
          No results
        </div><div v-else-if="loading">
          Spinner
        </div> -->

      <div v-for="page in posts" :key="`page-${posts.indexOf(page)}`" >
        <div v-if="page && page.show" >
          <!-- <h3>Page {{ posts.indexOf(page) }}</h3> -->
            <div class="c-block-list--shade o-content-container" data-js="filtered-results">
              <div v-for="post in page.posts" :key="post.id" class="u-lg-gutter">
                <div class="c-card rounded-lg mr-0 flex">
                  <div class="c-card__title">
                    <a :href="slugify(post.title)" :title="post.title" rel="">
                      {{ post.title }}
                    </a>
                  </div>

                  <div class="c-card__subtitle">
                    <!-- <p><strong>{{ post.subtitle }}</strong></p> -->
                    <p>{{ post.programProvider }}</p>
                  </div>

                  <div class="c-card__body">
                    {{ post.body }}
                  </div>

                  <div class="c-card__tags order-last">
                    <button v-for="people in post.population" :key="people.id" :class="'button--pill bg-' + slugify(people.name) + '--primary'" @click="link($event, 'pop', people.id)">
                      {{ people.name }}
                    </button><button v-for="category in post.categories" :key="category.name" :class="'button--pill bg-yellow--primary'" @click="link($event, 'cat', category.id)">
                      {{ category.name }}
                    </button>
                  </div>
                </div>

                <!-- <pre>{{ post }}</pre> -->
              </div>
            </div>

            <div class='o-container sticky o-navigation-spacing-bottom'>
              <div class='py-5 tablet:py-12 text-right'>
                <a href='https://airtable.com/shrX5OAHgzNMqV6zW' title='Share your thoughts about Mental Health for All' target='_blank' rel='nofollow noopener' class='button--primary button--text hover:text-primary border--primary bg-white mr-1'>
                  Feedback
                </a>

                <a href='#main' class='button--primary bg-yellow--primary text-black hover:text-black border-transparent' title='Back To Top'>
                  Back To Top
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- <div class="o-content-container--compact pagination mobile:flex justify-between">
        <div id="paginate" class="previous tablet:mr-3 mb-3 tablet:mb-0 text-center"></div>

        <div class="paginate text-center">
          <button @click="paginate" v-if="next" data-amount="1" class="button--outline button--outline--gray paginate">
            Next
          </button>
        </div>
      </div>

      <p>
        <button @click="paginate" v-if="next" data-amount="1">Load More Posts</button>
      </p> -->
    </div>
  </section>
</template>

<script>
  import Archive from '@nycopportunity/wp-archive-vue/src/archive.vue';

  export default Archive;
</script>
