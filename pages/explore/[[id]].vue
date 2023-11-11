<script setup lang="ts">
import type { VideoItem } from '~/models'
import { getVideoInfo, shareVideo } from '~/apis'

const route = useRoute()

const cardInfo = ref<VideoItem>()

if (route.params.id) {
  const { success, data } = await getVideoInfo(route.params.id as string)
  if (success) {
    cardInfo.value = data.video
    if (route.query.from === 'share') {
      shareVideo(cardInfo.value.id)
    }
  }
}

</script>

<template>
  <div>
    <FeedMain v-if="!route.params.id" />
    <div v-else class="mt-10 w-full flex-center overflow-x-hidden">
      <FeedContent
        class="h-200 overflow-x-hidden"
        :info="cardInfo"
        :active="true"
      />
    </div>

  </div>

</template>
