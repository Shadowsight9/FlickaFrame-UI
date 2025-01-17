<script setup lang="ts">
import Player from '@oplayer/core'
import type { PlayerOptions } from '@oplayer/core'
import ui from 'oplayer-ui-plus'
import type { VideoItem } from '~/models'
import dayjs from 'dayjs'

import { createVideoHistory, getQualityList } from '~/apis'

const props = withDefaults(defineProps<{
  active?: boolean
  url: string
  inSwiper?: boolean
  videoItem?: VideoItem
}>(), {
  active: true,
  inSwiper: false,
})

const expland = defineModel('expland', { default: false })

const router = useRouter()

enum RightController {
  Comment = '评论',
}

function convertVideoItem(item?: VideoItem) {
  if (!item) return undefined
  return {
    description: `${item.title} - ${item.description}`,
    userName: item.author.nickName,
    userUrl: router.resolve(`/profile/${item.author.userId}`).fullPath,
    time: dayjs(item.createdAt).format('YYYY年M月D日'),
    tags: item.tags.map(val => ({
      name: val.name,
      url: router.resolve(`/search?q=${val.name}`).fullPath,
    })),
  }
}

const playerOptions: PlayerOptions = {
  source: {
    src: props.url,
    poster: props.videoItem?.thumbUrl,
  },
}

const player = shallowRef<null | Player>(null)

const videoElement = ref<HTMLVideoElement | null>(null)
const historyStore = usePlayHistoryStore()

const playerUi = ui({
  keyboard: {
    focused: false,
    global: false,
  },
  menu: [
    {
      name: '画质',
      position: 'bottom', // or top
      children: getQualityList(props.url),
      onChange({ value }) {
        player.value?.changeQuality({ src: value })
      },
    },
  ],
  rightController: {
    items: [
      {
        name: RightController.Comment,
        iconSvg: '<div class="i-mdi-comment" />',
        defaultText: '',
      },
    ],
    onClick: (name: string) => {
      if (name === RightController.Comment) {
        expland.value = !expland.value
      }
    },
  },
  title: convertVideoItem(props.videoItem),
})

onMounted(() => {
  if (!videoElement.value) return
  player.value = Player
    .make(videoElement.value, playerOptions)
    .use([playerUi])
    .create()

  watch(() => props.active, (newVal) => {
    if (newVal) {
      if (props.videoItem && player.value) {
        createVideoHistory(props.videoItem.id)

        historyStore.create(props.videoItem.id, props.videoItem.videoDuration)

        player.value.on('loadedmetadata', () => {
          const prevTime = historyStore.get(props.videoItem!.id).lastProgress || 0
          player.value?.seek(prevTime)
        })
        player.value.play()
      }
    } else {
      player.value?.pause()
    }
  }, { immediate: true })

  player.value?.on(['play', 'playing'], () => {
    props.videoItem && historyStore.start(props.videoItem.id)
  })

  player.value?.on(['pause', 'destroy', 'abort', 'error'], () => {
    props.videoItem && historyStore.stop(props.videoItem.id, player.value?.currentTime)
  })
})

onUnmounted(() => {
  player.value?.destroy()
})

function registerSwiper() {
  if (!props.inSwiper) return

  const swiperSlide = useSwiperSlide()

  watch(swiperSlide, (newVal) => {
    if (newVal.isVisible) {
      player.value?.play()
    } else {
      player.value?.pause()
    }
  })
}

registerSwiper()

</script>

<template>
  <div class="bg-black">
    <div
      ref="videoElement"
      class="h-full w-full"
    />
  </div>

</template>
