<template>
  <section class="main-content section">
    <div class="container">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/category/">Category</a></li>
          <li class="is-active">
            <a :href="`/category/${$route.params.key}/`">{{
              $route.params.key
            }}</a>
          </li>
        </ul>
      </nav>
      <h1 class="title is-1">
        {{ $route.params.key }}
      </h1>
      <sparql-response-table :response="response" />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import SparqlResponseTable from '~/components/SparqlResponseTable.vue'
import { SparqlResponse } from '~/types/SparqlResponse'

export default Vue.extend({
  components: { SparqlResponseTable },
  async asyncData ({ $axios, params, error }) {
    const query = `
    prefix vlueprint: <https://vlueprint.org/schema/>
    prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?uri
    WHERE {
      ?uri a ?class.
      ?class rdfs:label "${params.key}".
    }`
    try {
      const response = await $axios.$get<SparqlResponse>('/sparql', {
        params: {
          query,
          format: 'application/sparql-results+json'
        },
        headers: { 'Content-Type': 'application/sparql-query+json' }
      })
      if (response.results.bindings.length) {
        return { response }
      } else {
        error({ statusCode: 404, message: 'Data not found' + query })
      }
    } catch (e) {
      console.log(e)
      error({ statusCode: 404, message: 'Data not found' })
    }
  }
})
</script>
