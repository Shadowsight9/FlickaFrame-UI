<script setup lang="ts">

import type { VideoItem } from '~/models'

const props = defineProps<{
  info: VideoItem
  raw?: boolean
}>()

const video = ref<HTMLVideoElement | null>(null)

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

useIntersectionObserver(video, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    video.value?.play()
  } else {
    video.value?.pause()
  }
})

const visibility = useDocumentVisibility()

watch(visibility, (v) => {
  if (v === 'hidden') {
    video.value?.pause()
  } else {
    video.value?.play()
  }
})

</script>

<template>

  <div class="min-w-140 flex border-b py-6 text-foreground">
    <UiAvatar size="base" class="cursor-pointer" @click="handleToProfile">
      <UiAvatarImage :src="info.author.avatarUrl" :alt="info.author.nickName" />
      <UiAvatarFallback>{{ info.author.nickName }}</UiAvatarFallback>
    </UiAvatar>
    <div class="px-4 pl-3">
      <div class="flex items-center justify-between pb-0.5">

        <span class="cursor-pointer font-bold hover:underline" @click="handleToProfile">
          {{ info.author.nickName }}
        </span>

      </div>
      <div class="max-w-[300px] break-words pb-0.5 text-lg">
        <div v-if="props.raw" v-html="info.description" />
        <template v-else> {{ info.description }}</template>

      </div>
      <div class="pb-0.5 text-gray-500">

        <span v-for="t in info.tags" :key="t.name">
          #{{ t.name }}
        </span>

      </div>
      <div class="flex items-center pb-0.5 font-semibold">

        <div class="i-mdi-music" />
        <div class="px-1">
          <div v-if="props.raw" v-html="info.description" />
          <template v-else>  {{ info.title }}</template>
        </div>
        <div class="i-mdi-heart" />

      </div>

      <div class="mt-2.5 flex">

        <video
          ref="video"
          loop
          muted
          class="mx-auto h-200 cursor-pointer rounded-xl object-cover"
          :src="info.playUrl"
          @click="handleToMain"
        />

        <div class="relative">
          <div class="absolute bottom-0 pl-2">
            <div class="pb-4 text-center">
              <UiButton size="icon" variant="outline" @click="handleToMain">
                <div class="i-mdi-heart" />
              </UiButton>
              <span class="text-xs font-semibold">{{ info.favoriteCount }}</span>
            </div>
            <div class="pb-4 text-center">
              <UiButton size="icon" variant="outline" @click="handleToMain">
                <div class="i-mdi-comment" />
              </UiButton>

              <span class="text-xs font-semibold">{{ info.commentNum }}</span>
            </div>
            <div class="text-center">
              <UiButton size="icon" variant="outline" @click="handleToMain">
                <div class="i-mdi-share" />
              </UiButton>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<style>
.highlight {
  @apply bg-#fffe46 color-black;
}
</style>
