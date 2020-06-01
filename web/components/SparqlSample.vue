<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ title }}
      </p>
    </header>
    <div class="card-content">
      <div class="content">
        <pre>{{code}}</pre>
        <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
      </div>
    </div>
    <footer class="card-footer">
      <a :href="gistUrl" class="card-footer-item">Gist (解説等)</a>
      <a :href="editorLink" class="card-footer-item">Open</a>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
export default Vue.extend({
  props: {
    gistUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: true,
      code: ' ',
      title: ' ',
      cmOptions: {
        mode: ' ',
        theme: 'base16-dark',
        lineNumbers: true,
        readOnly: true,
        fullLines: true
      }
    }
  },
  computed: {
    editorLink () {
      const encodedCode = encodeURIComponent(this.code)
      return `https://vlueprint.org/sparql?qtxt=${encodedCode}`
    }
  },
  async mounted () {
    const m = this.gistUrl.match(
      /https:\/\/gist\.github\.com\/.+?\/([0-9a-z]+)(#.+)?/
    )
    if(!m) return;
    const apiUrl = `https://api.github.com/gists/${m[1]}`
    const response = await axios.get(apiUrl)
    const file = response.data.files[Object.keys(response.data.files)[0]]
    this.code = file.content
    this.cmOptions.mode = file.type
    this.title = response.data.description
    this.isLoading = false;
  }
})
</script>

<style scoped>
.card {
  margin-bottom: 20px;
}
p.card-header-title {
  margin-bottom: 0;
}

pre {
  text-align: left;
}
</style>