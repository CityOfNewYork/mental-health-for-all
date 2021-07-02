<template>
  <section class="o-container u-bottom-spacing u-top-spacing-small desktop:flex">
    <div class='o-article-sidebar o-content-container--compact u-lg-gutter desktop:w-sidebar'>
      <div class='c-list-box c-list-box--quaternary js-accordion o-accordion' data-multiselectable="false" role="presentation" aria-multiselectable="false">
        <div v-for="term in terms" :key="term.term_id" class="c-list-box__item o-accordion__item">
          <!-- <button id="type-filter-heading" class="js-accordion__header c-list-box__heading o-accordion__header" type="button" aria-selected="false" aria-controls="type-filter-panel" aria-expanded="true">Program Categories
            <svg class="o-accordion__caret icon" aria-hidden="true"><use xlink:href="#icon-caret-down"></use>
            </svg>
          </button> -->
          <button data-js="accordion" type="button" :aria-controls="'aria-c-' + term.slug" aria-expanded="true" class='c-list-box__heading o-accordion__header bg-toddler--secondary'>
            {{term.name}}
            <svg class="o-accordion__caret icon" aria-hidden="true"><use xlink:href="#icon-caret-down"></use></svg>
          </button>
          <ul role="region" aria-hidden="false" :id="'aria-c-' + term.slug">
            <li class='c-list-box__subitem bg-toddler--primary'>
              <button
                @click="toggle({ event: $event, data: { parent: term.slug } })"
              >
                Toggle All
              </button>
            </li>
            <li v-for="filter in term.filters" :key="filter.slug" class='c-list-box__subitem bg-toddler--primary'>
              <label class="checkbox">
                <input
                  class="checkbox__field"
                  type="checkbox"
                  :value="filter.slug"
                  :checked="filter.checked"
                  @change="change({ event: $event, data: filter })"
                />
                <svg class="checkbox__indicator"><use xlink:href="#icon-check"></use></svg>
                <span v-html="filter.name">{{ filter.name }}</span>
              </label>
            </li>
          </ul>
        </div>
      </div>

    </div>

    <div class='o-article desktop:w-article'>
      <section class="c-block-list">
      <div v-for="page in posts" :key="`page-${posts.indexOf(page)}`" >
        <div v-if="page && page.show" >
          <h3>Page {{ posts.indexOf(page) }}</h3>
            <div class="c-block-list--shade o-content-container u-sm-gutter">
              <div v-for="post in page.posts" :key="post.id" class="c-block-list__item u-sm-gutter">
                <div class="c-card mr-0 flex">
                  <div class="c-card__title">
                    <a :href="slugify(post.title)" :title="post.title" rel="">
                      {{ post.title }}
                    </a>
                  </div>
                  <div class="c-card__subtitle">
                    <p><strong>{{ post.subtitle }}</strong></p>
                    <p>{{ post.programProvider }}</p>
                  </div>
                  <div class="c-card__body">
                    {{ post.body }}
                  </div>
                  <div class="c-card__tags order-last">
                    <button class="button--pill js-category button--pill--alt" @click="change({ event: $event, data: {parent: 'cat', id: post.category.id} })">
                      {{ post.category.name }}
                    </button>
                    <a class="button--pill js-category bg-pre-schooler--primary" href="#">
                      {{ post.population.name }}
                    </a>
                  </div>
                </div>
                  <!-- <pre>{{ post }}</pre> -->
              </div>
            </div>
        </div>
      </div>
      </section>
      <div class="o-content-container--compact pagination mobile:flex justify-between">
        <div id="paginate" class="previous tablet:mr-3 mb-3 tablet:mb-0 text-center">
          <!---->
        </div>
        <div class="paginate text-center">
          <button @click="paginate" v-if="next" data-amount="1" class="button--outline button--outline--gray paginate">
            Next
          </button>
        </div>
      </div>
      <p>
        <button @click="paginate" v-if="next" data-amount="1">
          Load More Posts
        </button>
      </p>
    </div>
  </section>
</template>

<script>
  import Archive from '@nycopportunity/wp-archive-vue/src/archive.vue';
  export default Archive;
</script>
