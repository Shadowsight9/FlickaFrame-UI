<script setup lang="ts">
import { useLikeChange } from '~/composables/useStore'
import { favoriteComment, favoriteVideo, unfavoriteComment, unfavoriteVideo } from '~/apis'

const props = defineProps<{
  liked?: boolean
  likedCount?: number
  id: string
  type: 'video' | 'comment'
  showShare: boolean
  shareNum?: number
}>()

const emit = defineEmits<{
  (e: 'reply'): void
  (e: 'share'): void
}>()

const store = useLikeChange()

const favoriteMap = {
  video: {
    fav: () => favoriteVideo(props.id),
    unfav: () => unfavoriteVideo(props.id),
  },
  comment: {
    fav: () => favoriteComment(props.id),
    unfav: () => unfavoriteComment(props.id),
  },
}

const action = favoriteMap[props.type]

const favoriteState = computed({
  get: () => store.get(props.id, { isLike: props.liked, likeCount: props.likedCount || 0 }),
  set: value => store.set(props.id, value),
})

const loading = ref(false)

async function changeLikeStatus() {
  if (loading.value) return
  loading.value = true

  const res = favoriteState.value.isLike ? (await action.unfav()) : (await action.fav())

  if (!res.success) {
    message.error(`${favoriteState.value.isLike ? '取消' : ''}点赞失败`)
  } else {
    message.info(`${favoriteState.value.isLike ? '取消' : ''}点赞成功`)
    favoriteState.value.isLike = !favoriteState.value.isLike
    favoriteState.value.likeCount = res.data.likeCount
  }
  loading.value = false
}

const likeCls = computed(() => {
  if (loading.value) return 'i-mdi-loading animate-spin'
  return favoriteState.value.isLike ? 'i-iconamoon-like-fill' : 'i-iconamoon-like'
})
</script>

<template>
  <div class="flex items-center text-base">
    <div class="wrapper" @click="changeLikeStatus">
      <div
        class="icon"
        :class="likeCls"
      />
      <div class="text">赞 {{ favoriteState.likeCount }}</div>
    </div>

    <div class="wrapper" @click="() => emit('reply')">
      <div class="icon i-iconamoon-comment" />
      <div class="text">{{ '' }}</div>
    </div>
    <div class="flex-1" />

    <div v-if="props.showShare" class="wrapper" @click="() => emit('share')">
      <div class="icon i-mdi-share" />
      <div class="text"> {{ props.shareNum }}</div>
    </div>

  </div>

</template>

<style scoped>
.wrapper {
  @apply flex-center;
  &:hover {
    @apply font-semibold cursor-pointer;
    & > .icon {
      @apply scale-115;
    }
  }
  & > .icon {
    @apply transition-all;
  }
  & > .text {
    @apply ml-1 mr-4 text-[0.9em];
  }
}

</style>
