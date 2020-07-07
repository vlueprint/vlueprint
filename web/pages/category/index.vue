<template>
  <section class="main-content section">
    <div class="container">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><a href="/">Home</a></li>
          <li class="is-active">
            <a href="/rdfs/">category</a>
          </li>
        </ul>
      </nav>
      <h1 class="title is-1">
        Category
      </h1>
      <ul>
        <template v-for="val in classes">
          <li :key="val"><a :href="`/category/${val}/`">{{val}}</a></li>
        </template>
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import SparqlResponseTable from '~/components/SparqlResponseTable.vue'
import { SparqlResponse } from '~/types/SparqlResponse'

export default Vue.extend({
  components: { SparqlResponseTable },
  head () {
    return {
      title: `category - vlueprint`,
      meta: [
        { hid: 'description', name: 'description', content: `vlueprint の「カテゴリー一覧」のページです。` }
      ]
    }
  },
  computed: {
    label (): string {
      let ret = ''
      // @ts-ignore
      this.response.results.bindings.forEach((binding) => {
        const labelUri = 'http://www.w3.org/2000/01/rdf-schema#label'
        if (binding.Property.value === labelUri) { ret = binding.Value.value }
      })
      return ret
    }
  },
  async asyncData ({ $axios, params, error }) {
    const query = `
    prefix vlueprint: <https://vlueprint.org/schema/>
    prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    select ?label {
      ?uri a rdfs:Class;
      rdfs:comment ?comment;
      rdfs:label ?label.
    }
    `
    try {
      const response = await $axios.get<SparqlResponse>('/sparql', {
        params: { query },
      })
      const classes =  response.data.results.bindings.map(binding=>binding["label"].value)
      return { classes }
    } catch (e) {
      console.log(e)
      error({ statusCode: 404, message: 'Data not found' })
    }
  }
})
</script>