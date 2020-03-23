<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  fetch({ redirect, params }) {
    redirect(303, `/page/${params.key}`)
  }
})
</script>