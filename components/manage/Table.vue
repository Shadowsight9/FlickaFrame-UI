<script setup lang="ts">

const store = useSessionStore()

const authorID = store.user.userId
const { feedList, isEnd, addMore, pending } = useFeedData(ref('0'), {
  authorID,
})

</script>

<template>
  <div
    class="flex flex-wrap items-center justify-evenly gap-2"
  >
    <ManageVideoCard v-for="item in feedList" :key="item.id" :info="item" />
  </div>

</template>
