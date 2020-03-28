<template>
  <section class="main-content section">
    <div class="container">
      <h1 class="title is-1">
        About: {{ label }}
      </h1>
      <sparql-response-table :response="response" />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import SparqlResponseTable from '~/components/SparqlResponseTable.vue'

import { SparqleResponse } from '~/types/SparqleResponse.d.ts'

interface Computed {
  label: string;
}

export default Vue.extend<any, any, Computed, any>({
  components: { SparqlResponseTable },
  head () {
    return {
      title: `${this.label} - vlueprint`,
      //title: ` - vlueprint`,
      meta: [
        { hid: 'description', name: 'description', content: `vlueprint の「${this.label}」のページです。` }
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
    const baseUrl = 'https://vlueprint.org'
    const namespace = (params.namespace === 'page') ? 'resource' : params.namespace
    const subjectUrl = `${baseUrl}/${namespace}/${params.key}`
    const query = `SELECT ?Property ?Value WHERE { <${subjectUrl}> ?Property ?Value }`
    try {
      const response = await $axios.get<SparqleResponse>('/sparql', {
        params: { query },
      })
      if (response.data.results.bindings.length) {
        return {
          response: response.data,
          key: params.key,
          className: params.class
        }
      } else {
        error({ statusCode: 404, message: 'Data not found' })
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Data not found' })
    }
  }
})
</script>