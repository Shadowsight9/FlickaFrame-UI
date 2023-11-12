<script setup lang="ts">
import { getFavoriteVideo } from '~/apis'
import { vAutoAnimate } from '~/composables/useAnimate'
import { ALL_CATEGORY } from '~/models'

const { feedList, isEnd, addMore, pending, refresh } = useFeedData(ref(ALL_CATEGORY), {}, getFavoriteVideo)

definePageMeta({
  needAuth: true,
})
</script>

<template>
  <div v-auto-animate class="p-4 space-y-3">

    <ManageVideoHistoryItem
      v-for="item in feedList"
      :key="item.id"
      :info="item"
      :is-own="false"
      @refresh="refresh"
    />

    <UiLoading :is-end="isEnd" :loading="pending" @load="addMore" />
  </div>

</template>
