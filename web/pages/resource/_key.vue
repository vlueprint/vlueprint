<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  fetch({ redirect, params }) {
    const location = `/page/${params.key || ''}`
    redirect(303, encodeURI(location))
  }
})
</script>