<script setup lang="ts">
import type { Comment, CommentTarget } from '~/models'
import { CommentLevel } from '~/models'

const props = defineProps<{
  authorId: string
  comments: Comment[] | null
}>()

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'reply', payload: CommentTarget): void
}>()

function handleReply(pid: string, tname: string, tid?: string) {
  emit('reply', {
    parentCommentId: pid,
    targetCommentId: tid,
    targetUserName: tname,
  })
}

</script>

<template>
  <div>

    <div
      v-for="item in comments"
      :key="item.id"
    >
      <FeedInteractionSubCommnet
        class="w-full"
        :author-id="props.authorId"
        :comment="item"
        :level="CommentLevel.Parent"
        @delete="emit('delete')"
        @reply="handleReply(item.id, item.userInfo.nickName)"
      />

      <template v-if="item.childComments.length">
        <FeedInteractionSubCommnet
          v-for="subItem in item.childComments"
          :key="subItem.id"
          class="ml-10"
          :level="CommentLevel.Child"
          :author-id="props.authorId"
          :comment="subItem"
          @delete="emit('delete')"
          @reply="handleReply(item.id, subItem.userInfo.nickName, subItem.id)"
        />
      </template>

    </div>

  </div>

</template>
