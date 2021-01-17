<template>
  <div class="container is-max-desktop mb-4">
    <div class="columns">
      <div class="column is-narrow image is-128x128">
        <img :src="icon" class="is-rounded">
      </div>
      <div class="column">
        <h1 class="title is-2">{{ virtualBeingData.label }}</h1>
        <p>URI : <span class="tag">{{ virtualBeingData.uri }}</span></p>
      </div>
      <div class="column is-narrow">
        <a
        v-for="screen_name in virtualBeingData.twitterAccount"
        :key="screen_name"
        class="mr-1"
        :href="`https://twitter.com/${screen_name}`"
        target="_blank">
          <gb-social-button network="twitter" size="small" rounded="true" />
        </a><a
        v-for="channelId in virtualBeingData.youtubeChannelId"
        :key="channelId"
        class="mr-1"
        :href="`https://www.youtube.com/channel/${channelId}`"
        target="_blank">
          <gb-social-button network="youtube" size="small" rounded="true" />
        </a>
      </div>
    </div>
    <div class="content">
      <p>
        <b>{{ virtualBeingData.label }}</b> はバーチャルな人物（あるいは存在）。
        <span v-if="virtualBeingData.belongTo.length > 0">
          {{ virtualBeingData.belongTo.join(" 、 ") }} に所属している。
        </span>
        <span v-if="virtualBeingData.belongTo.length > 0">
          {{ virtualBeingData.youtubeChannelName.join(" 、 ") }} というYoutubeチャンネルで活動を行っている。
        </span>
        <span v-if="virtualBeingData.twitterAccount.length > 0">
          Twitterのアカウントは {{ virtualBeingData.twitterAccount.join(" 、 ") }} 。
        </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import SparqlResponseTable from '~/components/SparqlResponseTable.vue'
import { SparqlResponse } from '~/types/SparqlResponse'

// この型が全く役に立っていないのでどう考えても実装が良くないがとりあえず動くのでヨシとしましょう
interface VirtualBeingData {
  uri: string
  label: string
  comment: string[]
  youtubeChannelName: string[]
  youtubeChannelId: string[]
  twitterAccount: string[]
  belongTo: string[]
  yomi: string[]
}

export default Vue.extend({
  components: {
    SparqlResponseTable
  },
  props: {
    response: {
      type: Object as PropType<SparqlResponse>,
      required: true
    },
    subjectUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      icon: "https://placehold.jp/400x400.png"
    }
  },
  async mounted() {
    const response = await this.$axios.get(`/api/icon?screen_name=${this.virtualBeingData.twitterAccount}`)
    this.icon = response.data.url
  },
  computed: {
    virtualBeingData(): VirtualBeingData {
      const ret: VirtualBeingData = {
        uri: "",
        label: "",
        comment: [],
        youtubeChannelName: [],
        youtubeChannelId: [],
        twitterAccount: [],
        belongTo: [],
        yomi: [],
      }
      ret.uri = this.subjectUrl
      for (const binding of this.response.results.bindings) {
        if (binding.Property.value === 'http://www.w3.org/2000/01/rdf-schema#label')
          ret.label = binding.Value.value
        if (binding.Property.value === 'http://www.w3.org/2000/01/rdf-schema#comment')
          ret.comment.push(binding.Value.value)
        if (binding.Property.value === 'https://vlueprint.org/schema/youtubeChannelName')
          ret.youtubeChannelName.push(binding.Value.value)
        if (binding.Property.value === 'https://vlueprint.org/schema/youtubeChannelId')
          ret.youtubeChannelId.push(binding.Value.value)
        if (binding.Property.value === 'https://vlueprint.org/schema/twitterAccount')
          ret.twitterAccount.push(binding.Value.value)
        if (binding.Property.value === 'https://vlueprint.org/schema/belongTo')
          ret.belongTo.push(binding.Value.value.replace("https://vlueprint.org/resource/", ""))
        if (binding.Property.value === 'https://vlueprint.org/schema/yomi')
          ret.yomi.push(binding.Value.value)
      }
      return ret
    },
  },
})
</script>

<style scoped>
a,
span {
  word-break: break-all;
}

.avatar {
  border-radius: 50%;
}
</style>