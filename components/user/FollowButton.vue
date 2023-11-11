<script setup lang="ts">

import { followUser, unfollowUser } from '~/apis'
import { debounce } from 'lodash-es'

const props = defineProps<{
  isFollow: boolean
  userId: string
}>()

const emit = defineEmits<{
  (e: 'changed'): void
}>()

const loading = ref(false)

const store = useFollowChange()

const isFollow = computed({
  get: () => store.get(props.userId, props.isFollow),
  set: value => store.set(props.userId, value),
})

const emitChanged = debounce(() => {
  emit('changed')
}, 1000)

async function changeFollowStatus() {
  if (loading.value) return
  loading.value = true
  const res = isFollow.value ? (await unfollowUser(props.userId)) : (await followUser(props.userId))

  if (!res.success) {
    message.error(`${isFollow.value ? '取消' : ''}关注失败`)
  } else {
    message.info(`${isFollow.value ? '取消' : ''}关注成功`)
    isFollow.value = !isFollow.value
    emitChanged()
  }
  loading.value = false
}

</script>

<template>
  <UiButton
    class="whitespace-nowrap"
    :variant="isFollow ? 'secondary' : 'outline'"
    :disabled="loading"
    @click="changeFollowStatus"
  >
    <div v-if="loading" class="i-mdi-loading mr-2 animate-spin" />  {{ isFollow ? '已关注' : '关注' }}
  </UiButton>

</template>
