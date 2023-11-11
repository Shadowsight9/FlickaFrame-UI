<script setup lang="ts">
import { ALL_CATEGORY } from '~/models'

const store = useSessionStore()

const authorID = store.user.userId
const { feedList, isEnd, addMore, pending } = useFeedData(ref(ALL_CATEGORY), { authorID })

</script>

<template>
  <div
    class="m-8 flex flex-col items-center gap-2"
  >
    <ManageVideoCard v-for="item in feedList" :key="item.id" :info="item" />
    <UiLoading :is-end="isEnd" :loading="pending" @load="addMore" />
  </div>

</template>
