<template>
  <div class="container">
    <SparqlSample v-for="sampleQuery in sampleQueries" :key="sampleQuery.url" :sampleQuery="sampleQuery" />
    <b-loading :is-full-page="false" :active="isLoading" ></b-loading>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import SparqlSample from "~/components/SparqlSample.vue";
import { SampleQuery } from '~/types/SampleQuery'
export default Vue.extend({
  components: {
    SparqlSample,
  },
  data () {
    return {
      isLoading: true,
      sampleQueries: [] as SampleQuery[]
    }
  },
  async mounted() {
    const response = await axios.get<SampleQuery[]>('/api/samples')
    this.sampleQueries = response.data
    this.isLoading = false
  }
})
</script>

<style lang='scss' scoped>
.container {
  position: relative;
}
</style>
