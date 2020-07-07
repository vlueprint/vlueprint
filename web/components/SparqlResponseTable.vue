<template>
  <b-table :data="response.results.bindings">
    <template slot-scope="props">
      <b-table-column
        v-for="(col, i) in response.head.vars"
        :key="i"
        :label="col"
      >
        <a
          v-if="props.row[col].type == 'uri'"
          :href="
            props.row[col].value.replace('https://vlueprint.org', '')
          "
        >{{ props.row[col].value
          .replace('https://vlueprint.org/resource/', '')
          .replace('https://vlueprint.org/schema/', 'vlueprint:')
          .replace('http://www.w3.org/1999/02/22-rdf-syntax-ns#', 'rdf:')
          .replace('http://www.w3.org/2000/01/rdf-schema#', 'rdfs:')
        }}</a>
        <span v-else>{{ props.row[col].value }}</span>
      </b-table-column>
    </template>
    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon icon="emoticon-sad" size="is-large" />
          </p>
          <p>Nothing here.</p>
        </div>
      </section>
    </template>
  </b-table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { SparqlResponse } from '~/types/SparqlResponse'
export default Vue.extend({
  props: {
    response: {
      type: Object as PropType<SparqlResponse>,
      required: true
    }
  }
})
</script>

<style scoped>
a,
span {
  word-break: break-all;
}
</style>