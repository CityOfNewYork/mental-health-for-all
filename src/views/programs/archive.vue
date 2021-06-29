<template>
  <main>
    <h1>WordPress Archive Vue</h1>
    <aside>
      <h2>Filters</h2>
      <details v-for="term in terms" :key="term.term_id">
        <summary>{{ term.name }}</summary>
        <ul>
          <li>
            <button
              @click="toggle({ event: $event, data: { parent: term.slug } })"
            >
              Toggle All
            </button>
          </li>
          <li v-for="filter in term.filters" :key="filter.slug">
            <label class="checkbox">
              <input
                type="checkbox"
                :value="filter.slug"
                :checked="filter.checked"
                @change="change({ event: $event, data: filter })"
              />
              <span v-html="filter.name">{{ filter.name }}</span>
            </label>
          </li>
        </ul>
      </details>
    </aside>

    <article>
      <h2>Posts</h2>

      <div v-for="page in posts" :key="`page-${posts.indexOf(page)}`">
        <div v-if="page && page.show">
          <h3>Page {{ posts.indexOf(page) }}</h3>

          <details v-for="post in page.posts" :key="post.id">
            <summary v-html="post.title">
              {{ post.title }}
            </summary>

            <pre>{{ post }}</pre>
          </details>
        </div>
      </div>

      <p>
        <button @click="paginate" v-if="next" data-amount="1">
          Load More Posts
        </button>
      </p>
    </article>
  </main>
</template>

<script>
  import Archive from '@nycopportunity/wp-archive-vue/src/archive.vue';
  export default Archive;
</script>
