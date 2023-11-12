<script setup lang="ts">
import { getHotVideo } from '~/apis'
import { vAutoAnimate } from '~/composables/useAnimate'
import { ALL_CATEGORY } from '~/models'

const categoryId = ref(ALL_CATEGORY)
const { feedList, pending } = useFeedData(categoryId, {}, getHotVideo)

const activeIndex = ref('')

function handleToMain(id: string) {
  navigateTo(`/explore/${id}`, {
    open: { target: '_blank' },
  })
}

</script>

<template>
  <div class="space-y-3">
    <FeedCategoryTab
      v-model="categoryId"
      :disabled="pending"
      class="sticky top-0 z-10"
    />

    <div v-auto-animate class="row-container flex flex-nowrap gap-4 overflow-x-scroll p-4">
      <FeedCard
        v-for="item, idx in feedList"
        :key="item.id"
        class="min-w-72"
        :rank="idx + 1"
        :info="item"
        :active="item.id === activeIndex"
        @hover="activeIndex = item.id"
        @click="handleToMain(item.id)"
      />
    </div>

  </div>

</template>

<style scoped>

.row-container::-webkit-scrollbar {
  display: none;
}
</style>
