<script setup lang="ts">
import { getCagegory } from '~/apis'
import { ALL_CATEGORY } from '~/models'

const selectedId = defineModel({ default: ALL_CATEGORY })

const fixedCategory = [
  { id: ALL_CATEGORY, name: '全部' },
]

const { data } = useAsyncData(async () => {
  const res = await getCagegory()
  if (!res.success) message.error('获取分类失败')
  const apiCategory = res.success ? res.data.categoryList : []
  return [...fixedCategory, ...apiCategory]
})

</script>

<template>

  <nav class="navbar-wrapper z-10 flex flex-wrap justify-start gap-6 overflow-hidden px-6 py-3">
    <UiButton
      v-for="item in data"
      :key="item.id"
      variant="outline"
      class="h-8 whitespace-nowrap border-accent/50 rounded-sm bg-accent/20 hover:bg-foreground/10"
      :class="{ selected: selectedId === item.id }"
      @click="selectedId = item.id"
    >
      {{ item.name }}
    </UiButton>
  </nav>

</template>

<style scoped>

.navbar-wrapper {
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: saturate(50%) blur(4px);
}
.dark .navbar-wrapper {
  background-color: rgba(255, 255, 255, 0);
}
.selected {
  @apply bg-foreground/10
}
</style>
