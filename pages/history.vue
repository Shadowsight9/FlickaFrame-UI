<script setup lang="ts">
import { getVideoHistory } from '~/apis'
import { vAutoAnimate } from '@formkit/auto-animate'
import { ALL_CATEGORY } from '~/models'

const { feedList, isEnd, addMore, pending, refresh } = useFeedData(ref(ALL_CATEGORY), {}, getVideoHistory)

</script>

<template>
  <div v-auto-animate class="p-4 space-y-3">

    <ManageVideoHistoryItem v-for="item in feedList" :key="item.id" :info="item" @refresh="refresh" />

    <UiLoading :is-end="isEnd" :loading="pending" @load="addMore" />
  </div>

</template>
