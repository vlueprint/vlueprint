<template>
  <h1>{{ key }}</h1>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  async asyncData ({ params }) {
    return {
      key: params.key
    }
  }
})
</script>