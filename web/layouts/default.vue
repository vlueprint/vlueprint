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
              <a class="navbar-link" href="/category/">Data Category</a>
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
</style>
