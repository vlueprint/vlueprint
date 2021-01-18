<template>
  <b-autocomplete
    :rounded="true"
    v-model="keyword"
    :data="results"
    placeholder="キズナアイ"
    icon="magnify"
    clearable
    @typing="search"
    @select="open">
    <template #empty>No results found</template>
    <template slot-scope="props">{{ props.option.label }}</template>
  </b-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { SparqlResponse } from '~/types/SparqlResponse'

interface Suggestion {
  uri: string
  label: string
}

export default Vue.extend({
  data() {
    return {
      keyword: "",
      results: [] as Suggestion[]
    }
  },
  methods: {
    async search() {
      if(this.keyword == "") {
        this.results = []
        return
      }
      try {
        const query = `
        prefix vlueprint: <https://vlueprint.org/schema/>
        prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT ?uri ?label
        WHERE {
          ?uri
            rdfs:label ?label;
            vlueprint:yomi ?yomi.
          FILTER ( regex(?label, "${this.keyword}") || regex(?yomi, "${this.keyword}") )
        }GROUP BY ?uri ?label
        `
        const response = await axios.get<SparqlResponse>('/sparql', {
          params: { query },
        })
        this.results = response.data.results.bindings.map(binding=>({
          uri: binding["uri"].value,
          label: binding["label"].value
        }))
      } catch (error) {
        this.results = []
      }
    },
    open(selected: Suggestion) {
      this.$router.push(selected.uri.replace("https://vlueprint.org", ""))
    }
  }
})
</script>

<style lang='scss' scoped>
@import 'bulma/bulma.sass';
</style>
