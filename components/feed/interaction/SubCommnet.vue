<script setup lang="ts">
import type { CommentItem, CommentLevel } from '~/models'
import { deleteComment } from '~/apis'
import dayjs from 'dayjs'

const props = defineProps<{
  videoId: string
  comment: CommentItem
  authorId: string
  level: CommentLevel
}>()

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'reply'): void
}>()

const store = useSessionStore()

const menus = computed(() => {
  const _menus = [
    {
      name: '删除评论',
      class: 'i-mdi-delete',
      visible: store.user.userId === props.comment.userInfo.userId,
      action: async (id: string) => {
        const { success } = await deleteComment(id, props.level, props.videoId)

        if (success) {
          emit('delete')
          message.success('删除成功')
        } else {
          message.error('删除失败')
        }
      },
    },
  ]

  return _menus.filter(item => item.visible !== false)
})

function handleReply() {
  emit('reply')
}

</script>

<template>
  <div class="flex gap-3 py-2">
    <UiAvatar size="base">
      <UiAvatarImage :src="props.comment.userInfo.avatarUrl" :alt="props.comment.userInfo.nickName" />
      <UiAvatarFallback>{{ props.comment.userInfo.nickName }}</UiAvatarFallback>
    </UiAvatar>
    <div class="flex-1">
      <div class="flex-1">
        <div class="flex items-center gap-2 text-foreground/60">
          <NuxtLink :to="`/profile/${props.comment.userInfo.userId}`" class="hover:text-foreground/80">
            {{ props.comment.userInfo.nickName }}
          </NuxtLink>

          <UiBadge v-if="props.authorId === props.comment.userInfo.userId" variant="outline">作者</UiBadge>
          <div class="flex-1" />

          <UiDropdownMenu v-if="menus.length">
            <UiDropdownMenuTrigger>
              <div class="rounded-full p-1 transition-all hover:bg-foreground/5">
                <div class="i-mdi-dots-vertical" />
              </div>
            </UiDropdownMenuTrigger>
            <UiDropdownMenuContent>
              <UiDropdownMenuItem
                v-for="m, idx in menus"
                :key="idx"
                @click="m.action(props.comment.id)"
              >
                <div class="mr-2" :class="m.class" /> {{ m.name }}
              </UiDropdownMenuItem>

            </UiDropdownMenuContent>
          </UiDropdownMenu>

        </div>
        <div class="mb-2 whitespace-normal text-base">
          <span
            v-if="props.comment.targetComment"
            class="whitespace-pre-wrap"
          >回复 {{ props.comment.targetComment.userInfo.nickName }}: </span>
          {{ props.comment.content }}
        </div>
        <div class="mb-1 text-sm text-foreground/50"> {{ dayjs(props.comment.createTime).format('YYYY-MM-DD') }} </div>

        <FeedInteractionLine
          :id="props.comment.id"
          :liked="props.comment.liked"
          :liked-count="props.comment.likedCount"
          type="comment"
          class="text-lg"
          :show-share="false"
          @reply="handleReply"
        />
      </div>
    </div>
  </div>

</template>
