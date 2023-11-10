<script setup lang="ts">
import Player from '@oplayer/core'
import type { PlayerOptions } from '@oplayer/core'
import ui from 'oplayer-ui-plus'
import type { VideoItem } from '~/models'
import dayjs from 'dayjs'

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

function useVideo() {
  const player = shallowRef<null | Player>(null)
  const videoElement = ref<HTMLVideoElement | null>(null)

  const playerUi = ui({
    keyboard: {
      focused: false,
      global: false,
    },
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
        player.value?.play()
      } else {
        player.value?.pause()
      }
    }, { immediate: true })
  })

  onUnmounted(() => {
    player.value?.destroy()
  })

  return { videoElement, player }
}

const { videoElement, player } = useVideo()

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
