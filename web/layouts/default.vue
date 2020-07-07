<template>
  <div>
    <nav class="navbar has-background-transparent is-transparent is-fixed-top">
      <div class="container px-4">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <img src="~assets/logo_mini.png" alt="Buefy" height="28">
          </a>
          <div
            class="navbar-burger"
            :class="{ 'is-active': menuActive }"
            @click="menuToggle()"
          >
            <span /><span /><span />
          </div>
        </div>
        <div class="navbar-menu" :class="{ 'is-active': menuActive }">
          <div class="navbar-start">
            <a class="navbar-item" href="/">Home</a>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link" href="/category/">Data</a>
              <div class="navbar-dropdown is-boxed">
                <template v-for="val in classes">
                  <a class="navbar-item" :href="`/category/${val}/`" :key="val">{{val}}</a>
                </template>
              </div>
            </div>
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              <a class="button is-info" href="/sparql/">Sparql Endpoint</a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <nuxt />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SparqlResponse } from '~/types/SparqlResponse'
export default Vue.extend({
  data () {
    return {
      menuActive: false,
      classes: [] as string[]
    }
  },
  watch: {
    $route () {
      this.menuActive = false
    }
  },
  methods: {
    menuToggle () {
      this.menuActive = !this.menuActive
    }
  },
  async mounted() {
    const query = `
    prefix vlueprint: <https://vlueprint.org/schema/>
    prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>

    select ?label {
      ?uri a rdfs:Class;
      rdfs:comment ?comment;
      rdfs:label ?label.
    }
    `
    const response = await this.$axios.get<SparqlResponse>('/sparql', {
      params: { query },
    })
    this.classes =  response.data.results.bindings.map(binding=>binding["label"].value)
  }
})
</script>

<style lang='scss'>
@import 'bulma/bulma.sass';

.has-background-transparent {
  background-color: transparent;
}
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
