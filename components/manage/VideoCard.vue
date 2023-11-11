<script setup lang='ts'>
import type { VideoItem } from '~/models'
import { deleteVideo } from '~/apis'
import dayjs from 'dayjs'

const props = defineProps<{
  info: VideoItem
}>()

const statistics = computed(() => {
  return [
    {
      title: '播放量',
      class: 'i-mdi-filmstrip-box',
      value: 0,
    },
    {
      title: '点赞数',
      class: 'i-mdi-like',
      value: props.info.favoriteCount,
    },
    {
      title: '评论数',
      class: 'i-mdi-comment',
      value: props.info.commentNum,
    },
    {
      title: '分享数',
      class: 'i-mdi-share',
      value: 0,
    },
  ]
})

async function handleDeleteVideo(id: string) {
  const { success } = await deleteVideo(id)
  if (success) {
    message.success('删除视频成功')
  } else {
    message.error('删除视频失败')
  }
}

</script>

<template>
  <div class="m-2 h-68 w-2/5 flex items-center gap-4 rounded-md bg-secondary/40 px-4 py-2">

    <div class="relative h-60 w-60 cursor-pointer overflow-hidden p-2" @click="navigateTo(`/explore/${info.id}`)">
      <img :src="info.thumbUrl" class="h-full w-full rounded-md object-cover">
      <div class="absolute bottom-3 right-3 rounded-md bg-black p-1 text-sm text-white opacity-70">
        {{ formatDuration(props.info.videoDuration) }}
      </div>
    </div>

    <div class="h-full flex flex-1 flex-col justify-between py-6">
      <h3 class="flex items-center gap-2 text-lg font-semibold">
        {{ info.title }}

      </h3>
      <span class="text-sm text-foreground/60">
        分区: {{ info.category.name }}
      </span>

      <div class="pb-6"> {{ dayjs(info.createdAt).format('YYYY-MM-DD hh:mm:ss') }}</div>

      <div class="flex gap-5 text-base color-foreground/75">
        <UiTooltipProvider v-for="item in statistics" :key="item.title">
          <UiTooltip>
            <UiTooltipTrigger>
              <div class="flex-center">
                <div
                  class="mr-1"
                  :class="item.class"
                />
                {{ item.value }}
              </div>

            </UiTooltipTrigger>
            <UiTooltipContent>
              {{ item.title }}
            </UiTooltipContent>
          </UiTooltip>
        </UiTooltipProvider>

      </div>
    </div>

    <div class="flex-col-center gap-6 p-2">

      <UiButton>
        <div class="i-mdi-edit mr-1" />
        编辑
      </UiButton>

      <UiButton variant="destructive" @click="handleDeleteVideo(info.id)">
        <div class="i-mdi-delete mr-1" />
        删除
      </UiButton>

    </div>

  </div>

</template>
