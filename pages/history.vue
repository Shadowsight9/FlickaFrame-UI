<script setup lang="ts">
import { cleanVideoHistory, getVideoHistory } from '~/apis'
import { vAutoAnimate } from '@formkit/auto-animate'
import { ALL_CATEGORY } from '~/models'

const { feedList, isEnd, addMore, pending, refresh } = useFeedData(ref(ALL_CATEGORY), {}, getVideoHistory)

const loading = ref(false)
const historyStore = usePlayHistoryStore()

async function cleanHistory() {
  loading.value = true
  const { success } = await cleanVideoHistory()

  if (success) {
    refresh()
    historyStore.cleanup()
    message.success('清空成功')
  } else {
    message.error('清空失败')
  }
  loading.value = false
}

definePageMeta({
  needAuth: true,
})
</script>

<template>
  <div v-auto-animate class="p-4 space-y-3">
    <div class="flex flex-row-reverse">
      <UiButton variant="destructive" @click="cleanHistory">
        <div v-if="loading" class="i-mdi-loading animate-spin" />
        🗑️ 清空所有
      </UiButton>
    </div>

    <ManageVideoHistoryItem v-for="item in feedList" :key="item.id" :info="item" @refresh="refresh" />

    <UiLoading :is-end="isEnd" :loading="pending" @load="addMore" />
  </div>

</template>
