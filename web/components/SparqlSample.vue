<template>
  <b-collapse :open.sync="open" class="card">
    <template v-slot:trigger="props">
      <div class="card-header" role="button">
        <p class="card-header-title">
          {{ title }}
        </p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
        </a>
      </div>
    </template>
    <div class="card-content">
      <div class="content">
        <pre>{{code}}</pre>
      </div>
    </div>
    <footer class="card-footer">
      <a :href="gistUrl" class="card-footer-item">Original Gist (解説等)</a>
      <a :href="editorLink" class="card-footer-item">Open</a>
    </footer>
  </b-collapse>
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
      open: false,
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
  watch: {
    open () {
      //this.code += ' '
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