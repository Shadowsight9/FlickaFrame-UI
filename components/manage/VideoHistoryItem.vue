<script setup lang="ts">
import type { VideoItem } from '~/models'
import { deleteVideoHistory } from '~/apis'
import dayjs from 'dayjs'

const props = defineProps<{
  info: VideoItem
  isOther?: boolean
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const historyStore = usePlayHistoryStore()

function getHistory() {
  if (props.isOther) {
    return { videoHistory: undefined, watchedPercent: 0 }
  }

  const videoHistory = historyStore.get(props.info.id)
  const watchedPercent = videoHistory ? videoHistory.consumed / videoHistory.total : 0

  return { videoHistory, watchedPercent }
}

const { videoHistory, watchedPercent } = getHistory()

const loading = ref(false)

function handleToProfile() {
  navigateTo(`/profile/${props.info.author.userId}`, {
    open: { target: '_blank' },
  })
}

function handleToMain() {
  navigateTo(`/explore/${props.info.id}`, {
    open: { target: '_blank' },
  })
}

async function deleteHistory() {
  loading.value = true
  const { success } = await deleteVideoHistory(props.info.id)
  if (success) {
    historyStore.del(props.info.id)
    message.success('删除成功')
    emit('refresh')
  } else {
    message.error('删除失败')
  }
}

</script>

<template>
  <div class="m-2 w-full flex items-center gap-3">
    <div v-if="!isOther" class="min-w-24 text-sm font-mono text-foreground/70">
      {{ videoHistory?.lastWatchedAt ? dayjs(videoHistory.lastWatchedAt * 1000).format('M-D HH:mm') : '' }}
    </div>
    <div class="flex flex-1 border rounded-lg shadow">
      <div class="relative h-50 w-50 overflow-hidden rounded-lg">
        <img :src="props.info.thumbUrl" class="h-full w-full object-cover">
        <div class="absolute bottom-0 right-0 w-full">
          <UiProgress :model-value="Math.min(watchedPercent * 100, 100)" class="h-2" />
        </div>
      </div>
      <div class="relative w-full flex flex-col justify-between p-4 pl-4">
        <h2 class="cursor-pointer font-semibold" @click="handleToMain">
          {{ props.info.title }}
        </h2>
        <p class="text-sm">
          {{ props.info.description }}
        </p>

        <div>
          <span class="w-full inline-flex items-center text-sm text-foreground/50">

            <template v-if="videoHistory?.lastProgress && !isOther">
              <div class="i-mdi-laptop mr-2" />
              上次看到 {{ formatDuration(videoHistory?.lastProgress) }}
            </template>
            <template v-else-if="!isOther">
              <div class="i-mdi-earth-remove mr-2" />
              进度丢失
            </template>

            <div class="flex-1" />
            <div class="h-5 flex cursor-pointer items-center text-sm" @click="handleToProfile">
              <UiAvatar size="sm" class="mr-1">
                <UiAvatarImage :src="props.info.author.avatarUrl" :alt="props.info.author.nickName" />
                <UiAvatarFallback>{{ props.info.author.nickName }}</UiAvatarFallback>
              </UiAvatar>
              {{ props.info.author.nickName }}
              <UiSeparator orientation="vertical" class="mx-2" />
              {{ props.info.category.name }}
            </div>
            <div class="flex-1" />
          </span>

        </div>

        <UiTooltipProvider v-if="!isOther">
          <UiTooltip>
            <UiTooltipTrigger class="absolute bottom-1/2 right-4 translate-y-1/2">
              <div
                class="i-mdi-delete cursor-pointer text-lg transition-all hover:scale-115"
                @click="deleteHistory"
              />
            </UiTooltipTrigger>
            <UiTooltipContent>
              <p>删除历史记录</p>
            </UiTooltipContent>
          </UiTooltip>
        </UiTooltipProvider>

      </div>
    </div>

  </div>

</template>
