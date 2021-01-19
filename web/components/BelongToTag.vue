<template>
  <a :href="belongTo">
    <span class="tag is-large mx-3">
      <span class="mr-3">{{ label }} </span>
      <span v-for="vb in member" :key="vb.uri">
        <img :src="vb.icon" width="42" height="42" class="avatar">
      </span>
      <span v-if="isShort" class="mx-3"> ...</span>
    </span>
  </a>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { SparqlResponse } from '~/types/SparqlResponse'

interface VirtualBeingData {
  uri: string
  label: string
  twitterAccount: string
  icon: string
}

export default Vue.extend({
  props: {
    belongTo: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      label: '',
      member: [] as VirtualBeingData[],
      isShort: false
    }
  },
  async mounted () {
    const response2 = await axios.get<SparqlResponse>('/sparql', {
      params: {
        query: `
        prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?label
        WHERE {
          <${this.belongTo}> rdfs:label ?label.
        }
      `
      }
    })
    this.label = response2.data.results.bindings[0].label.value

    const query = `
    prefix vlueprint: <https://vlueprint.org/schema/>
    prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    SELECT ?uri ?label ?twitterAccount
    WHERE {
      ?uri
        rdfs:label ?label;
        vlueprint:twitterAccount ?twitterAccount;
        vlueprint:belongTo <${this.belongTo}>.
    }GROUP BY ?uri
    `
    const response = await axios.get<SparqlResponse>('/sparql', {
      params: { query }
    })
    const allLength = response.data.results.bindings.length
    this.member = response.data.results.bindings.map(binding => ({
      uri: binding.uri.value,
      label: binding.label.value,
      twitterAccount: binding.twitterAccount.value,
      icon: ''
    })).slice(0, 5)

    this.isShort = allLength > this.member.length

    for (const i in this.member) {
      this.member[i].icon = (await axios.get(`/api/icon?screen_name=${this.member[i].twitterAccount}`)).data.url
    }
  }
})
</script>

<style scoped>
.avatar {
  border-radius: 50%;
}
</style>
