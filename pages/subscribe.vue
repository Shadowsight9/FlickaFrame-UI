<script setup lang="ts">
import { getFollowingVideo } from '~/apis'
import { ALL_CATEGORY } from '~/models'

definePageMeta({
  needAuth: true,
})

const { feedList, isEnd, addMore, pending } = useFeedData(ref(ALL_CATEGORY), {}, getFollowingVideo)

</script>

<template>
  <div class="flex gap-8 px-8">

    <div class="flex-1">
      <FeedActivity v-for="item in feedList" :key="item.id" :info="item" />
      <UiLoading :is-end="isEnd" :loading="pending" @load="addMore" />
    </div>

    <div class="sticky top-8 h-100 w-100 rounded-lg bg-gray/90">

      推荐的博主
    </div>

  </div>

</template>
