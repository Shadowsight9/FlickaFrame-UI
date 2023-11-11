<script setup lang="ts">
import type { VideoItem } from '~/models'
import { getVideoInfo } from '~/apis'
const props = withDefaults(defineProps<{
  info: VideoItem
  active?: boolean
  card?: boolean
}>(), {
  active: true,
  card: true,
})

const emit = defineEmits<{
  (e: 'active'): void
}>()
const info = ref(props.info)

const expland = ref(true)

async function refreshVideoInfo() {
  const { success, data } = await getVideoInfo(info.value.id)

  if (success) {
    info.value = data.video
  } else {
    message.error('获取视频信息失败')
  }
}

</script>

<template>
  <div
    class="relative max-w-screen flex overflow-hidden"
    :class="props.card ? 'border rounded-lg shadow-lg dark-border-blue/20' : 'h-full w-full'"
  >
    <div
      v-if="!props.active"
      class="absolute inset-0 z-10 cursor-pointer bg-black opacity-30"
      @click.stop="emit('active')"
    />
    <UiPlayer
      v-model:expland="expland"
      :active="active"
      :url="info.playUrl"
      :video-item="props.info"
      class="h-full"
      :class="props.card ? 'aspect-9/16' : 'flex-1'"
    />
    <FeedInteraction
      v-show="expland"
      :info="info"
      class="h-full bg-background md:hidden 2xl:w-120 lg:w-100 lg:flex"
      @refresh="refreshVideoInfo"
    />
  </div>
</template>
