<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ simpleTitle }}
        <span>
          <a :href="editorLink" class="button is-primary">エンドポイントで開く</a>
          <a :href="sampleQuery.url" class="button is-info">ピコプラSPACEで開く</a>
        </span>
      </p>
    </header>
    <div class="card-content">
      <div class="content">
        <pre>{{ sampleQuery.query }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { SampleQuery } from '~/types/SampleQuery'
export default Vue.extend({
  props: {
    sampleQuery: {
      type: Object as PropType<SampleQuery>,
      required: true
    }
  },
  computed: {
    editorLink (): string {
      const encodedCode = encodeURIComponent(this.sampleQuery.query)
      return `https://vlueprint.org/sparql?qtxt=${encodedCode}`
    },
    simpleTitle (): string {
      return this.sampleQuery.title.replace(/^(Vlueprint で)/, '')
    }
  }
})
</script>

<style scoped>
.card {
  margin-bottom: 20px;
}
p.card-header-title {
  margin-bottom: 0;
  display: flex;
  justify-content: space-between;
}

pre {
  text-align: left;
}
</style>
