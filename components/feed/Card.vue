<script setup lang='ts'>
import { useCardHeight } from '~/composables/useFeedLayout'
import type { VideoItem } from '~/models'
import rank1Svg from '~/assets/rank1.svg'
import rank2Svg from '~/assets/rank2.svg'
import rank3Svg from '~/assets/rank3.svg'

const props = defineProps<{
  info: VideoItem
  active?: boolean
  rank?: number
}>()

const emit = defineEmits<{
  (e: 'hover', info: VideoItem): void
}>()

// TODO 卡片高度
const maxHeight = 500
const minHeight = 340

const height = computed(() => {
  if (props.rank) {
    return `${minHeight}px`
  }
  return `${Math.floor(Math.random() * (maxHeight - minHeight) + minHeight)}px`
})
const { rootElement } = useCardHeight()

function getRankAssert(rank: number) {
  switch (rank) {
    case 1:
      return { img: rank1Svg, text: '冠军' }
    case 2:
      return { img: rank2Svg, text: '亚军' }
    case 3:
      return { img: rank3Svg, text: '季军' }
    default:
      return { text: `第${rank}名` }
  }
}

const rankAssert = computed(() => {
  if (props.rank) {
    return getRankAssert(props.rank)
  }
})

function useVideoCard() {
  const cardElement = ref<HTMLElement | null>(null)
  const videoElement = ref<HTMLVideoElement | null>(null)
  const _isCardHovered = useElementHover(cardElement)

  const isCardHovered = computed(() => _isCardHovered.value && props.active)

  watch(_isCardHovered, (newVal) => {
    if (newVal) {
      emit('hover', props.info)
    }
  })

  let playPromise: Promise<void> | undefined

  watch(isCardHovered, async (newVal) => {
    await nextTick()
    if (!newVal) {
      if (playPromise) {
        playPromise.then(() => videoElement.value?.pause())
      }
    } else if (videoElement.value) {
      playPromise = videoElement.value.play()
    }
  })

  return { cardElement, videoElement, isCardHovered }
}

const { cardElement, videoElement, isCardHovered } = useVideoCard()
</script>

<template>

  <div
    ref="rootElement"
    class="w-full flex flex-col overflow-hidden border rounded-5 bg-background shadow dark:border-0"
  >
    <div
      ref="cardElement"
      class="card-main card-height relative rounded-5 transition-400 hover:brightness-94 hover:filter"
    >
      <div
        class="card-height card-overlay relative"
        :class="{ 'opacity-0': isCardHovered }"
      >
        <img class="h-full w-full object-cover" :src="props.info.thumbUrl">
        <div class="absolute bottom-2 right-2 rounded-md bg-black/30 p-1 text-sm text-white/80">
          {{ formatDuration(props.info.videoDuration) }}
        </div>

        <div
          v-if="rankAssert"
          class="absolute left-0 top-0 flex-inline items-center rounded-br-lg bg-#7d8498 p-2 px-5 text-white/80 opacity-80"
        >
          <img v-if="rankAssert.img" :src="rankAssert.img" class="z-10 mr-2"> {{ rankAssert.text }}
        </div>
      </div>
      <video
        ref="videoElement"
        class="card-overlay card-height"
        :class="{ '-z-1 opacity-0': !isCardHovered }"
        loop autoplay muted playsinline
        preload="none"
        wdith="100%"
        :src="props.info.playUrl"
        mediatype="video"
      />
    </div>

    <div class="cursor-pointer p-3 align-middle text-foreground">
      <UiBadge variant="secondary" class="mr-1">{{ props.info.category.name }} </UiBadge>    {{ props.info.title }}
    </div>
    <div class="mb-4 flex cursor-pointer justify-between px-3 text-sm">
      <div class="flex items-center gap-1">
        <UiAvatar size="sm">
          <UiAvatarImage :src="props.info.author.avatarUrl" :alt="props.info.author.nickName" />
          <UiAvatarFallback>{{ props.info.author.nickName }}</UiAvatarFallback>
        </UiAvatar>
        <span class="text-sm text-foreground/70">
          {{ props.info.author.nickName }}
        </span>
      </div>

      <div class="flex items-center gap-1 text-foreground/80">
        <div class="i-mdi-eye" />
        {{ props.info.viewNum }}
        <div class="i-mdi-like ml-3" />
        {{ props.info.favoriteCount }}
      </div>
    </div>
  </div>

</template>

<style scoped>
.card-overlay {
  @apply absolute left-0 top-0 h-full w-full object-cover transition-all
}

.card-height {
  height: v-bind(height);
}
</style>
