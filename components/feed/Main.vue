<script setup lang="ts">
import { useCardColumnNum } from '~/composables/useFeedLayout'

const props = withDefaults(defineProps<{
  authorId?: string
  showCagegory?: boolean
}>(), {
  showCagegory: true,
})

const isOpen = ref(false)

const categoryId = ref('0')

const { cardColumnNum, listElement } = useCardColumnNum()

const { feedList, isEnd, addMore, pending } = useFeedData(categoryId, {
  authorID: props.authorId,
})

const activeIndex = ref(-1)
const openedIndex = ref(-1)

function handleOpenModal(idx: number) {
  isOpen.value = true
  openedIndex.value = idx
}

</script>

<template>
  <div class="dark:bg-slate/10">
    <FeedCategoryTab
      v-if="props.showCagegory"
      v-model="categoryId"
      :disabled="pending"
      class="sticky top-0 z-10"
    />
    <div ref="listElement" class="feed-list px-6">
      <FeedCard
        v-for="item, idx in feedList"
        :key="item.id"
        :info="item"
        :active="idx === activeIndex"
        @hover="activeIndex = idx"
        @click="handleOpenModal(idx)"
      />
    </div>
    <FeedModal
      v-model="isOpen"
      v-model:current="openedIndex"
      :items="feedList || []"
    />
    <UiLoading :is-end="isEnd" :loading="pending" @load="addMore" />
  </div>

</template>

<style scoped>

.feed-list {
  --feed-row-unit: 5px;
  --feed-col-unit: 2rem;
  display: grid;
  grid-auto-rows: var(--feed-row-unit);
  grid-template-columns: repeat(v-bind(cardColumnNum), 1fr);
  column-gap: var(--feed-col-unit);
  align-items: start;
  justify-content: space-between;
}

.feed-list.transitioning {
  transition: all ease-in-out 1s;
}
</style>
