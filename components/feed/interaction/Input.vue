<script setup lang='ts'>
import type { CommentTarget } from '~/models'
import { createCommnet, createSubComment } from '~/apis'

const props = defineProps<{
  videoId: string
}>()

const emit = defineEmits<{
  (e: 'send'): void
}>()

const commentTarget = defineModel<CommentTarget | undefined>('target')

const text = ref('')
const atElement = ref<HTMLElement | null>(null)
const { width: atElementWidth } = useElementSize(atElement)

const inputFoucsed = ref(false)

const loading = ref(false)

async function send() {
  loading.value = true
  let successFlag = false
  if (commentTarget.value) {
    const { success } = await createSubComment({
      content: text.value,
      videoId: props.videoId,
      parentCommentId: commentTarget.value.parentCommentId,
      targetCommentId: commentTarget.value.targetCommentId,
    })
    successFlag = success
  } else {
    const { success } = await createCommnet({
      content: text.value,
      videoId: props.videoId,
    })
    successFlag = success
  }

  if (successFlag) {
    text.value = ''
    commentTarget.value = undefined
    emit('send')
    message.success('评论成功')
  } else {
    message.error('评论失败')
  }
  inputFoucsed.value = true
  loading.value = false
}

onKeyStroke('Backspace', () => {
  if (text.value) return
  if (!inputFoucsed.value) return

  commentTarget.value = undefined
})

</script>

<template>
  <div class="flex items-center gap-2 transition-all">

    <div class="relative flex-1">
      <UiInput
        v-model:is-focus="inputFoucsed"
        v-model="text"
        :style="{ paddingLeft: commentTarget ? `calc(${atElementWidth}px + 2.1rem)` : '0.75rem' }"
        class="input h-12 text-base"
        required
        :disabled="loading"
        aria-placeholder="说点什么吧..."
        @keyup.enter="send"
      />
      <div class="input-hint pointer-events-none absolute top-0 h-full w-full flex items-center pl-4 text-foreground/40">

        <template v-if="!commentTarget && !text">
          <div class="i-mdi-pencil-plus-outline mr-2" />
          说点什么吧....
        </template>
        <template v-else-if="commentTarget">
          <div ref="atElement" class="rounded bg-foreground/10 px-2 py-1 text-foreground/70">
            @{{ commentTarget.targetUserName }}
          </div>
        </template>

      </div>
    </div>

    <UiButton
      v-if="text"
      type="submit"
      :disabled="loading"
      class="h-12 rounded-sm px-6 text-base transition-all" @click="send"
    >
      <div v-if="loading" class="i-mdi-loading mr-2 animate-spin" />
      发送
    </UiButton>
  </div>

</template>
