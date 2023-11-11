<script setup lang="ts">
const props = defineProps<{
  isEnd: boolean
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'load'): void
}>()

const loadingElement = ref<HTMLDivElement | null> (null)

useIntersectionObserver(loadingElement, (vals) => {
  if (props.loading || props.isEnd) return
  if (vals.some(item => item.isIntersecting)) {
    emit('load')
  }
}, { immediate: true })

</script>

<template>

  <div
    ref="loadingElement"
    class="flex-center gap-2 py-4"
  >
    <template v-if="!props.isEnd">
      <div v-if="props.loading" class="i-mdi-loading animate-spin" />
      正在加载 ...

    </template>
    <template v-else>
      <span class="text-foreground/50">- 已经到底了 -</span>
    </template>
  </div>
</template>
