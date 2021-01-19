<template>
  <section class="main-content section">
    <div v-if="!isVirtualBeing" class="container is-max-desktop">
      <h1 class="title is-1">
        About: {{ label }}
      </h1>
      <p>{{ subjectUrl }}</p>
    </div>
    <VirtualBeingInfo v-if="isVirtualBeing" :response="response" :subject-url="subjectUrl" />
    <div class="container is-max-desktop">
      <sparql-response-table :response="response" />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import SparqlResponseTable from '~/components/SparqlResponseTable.vue'
import VirtualBeingInfo from '~/components/VirtualBeingInfo.vue'

import { SparqlResponse } from '~/types/SparqlResponse'

export default Vue.extend({
  components: { SparqlResponseTable, VirtualBeingInfo },
  async asyncData ({ $axios, params, error }) {
    const baseUrl = 'https://vlueprint.org'
    const namespace = (params.namespace === 'page') ? 'resource' : params.namespace
    const subjectUrl = `${baseUrl}/${namespace}/${params.key}`
    const query = `SELECT ?Property ?Value WHERE { <${subjectUrl}> ?Property ?Value }`
    try {
      const response = await $axios.get<SparqlResponse>('/sparql', {
        params: { query }
      })
      if (response.data.results.bindings.length) {
        return {
          response: response.data,
          subjectUrl
        }
      } else {
        error({ statusCode: 404, message: 'Data not found' })
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Data not found' })
    }
  },
  data () {
    return {
      response: null as SparqlResponse | null,
      subjectUrl: ''
    }
  },
  head () {
    return {
      title: `${(this as any).label} - vlueprint`,
      meta: [
        { hid: 'description', name: 'description', content: `vlueprint の「${(this as any).label}」のページです。` }
      ]
    }
  },
  computed: {
    label (): string {
      if (!this.response) { return '' }
      for (const binding of this.response.results.bindings) {
        if (binding.Property.value === 'http://www.w3.org/2000/01/rdf-schema#label') {
          return binding.Value.value
        }
      }
      return ''
    },
    isVirtualBeing (): boolean {
      if (!this.response) { return false }
      for (const binding of this.response.results.bindings) {
        if (binding.Property.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
          return binding.Value.value === 'https://vlueprint.org/schema/VirtualBeing'
        }
      }
      return false
    }
  }
})
</script>
