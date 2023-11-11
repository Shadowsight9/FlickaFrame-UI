<script setup lang="ts">

import type { VideoItem } from '~/models'

const props = defineProps<{
  items: VideoItem[]
}>()

const cardList = computed(() => props.items)

const show = defineModel({ default: false })
const cardIndex = defineModel('current', { default: -1 })

const modalElement = ref<HTMLDivElement | null>(null)

function useCardScroll(cardIndex: Ref<number>, cardList: Ref<VideoItem[]>) {
  const scrollWindow = 2
  const leftOffset = ref(0)

  const slideWindow = computed(() => {
    const start = cardIndex.value - scrollWindow + leftOffset.value
    const end = cardIndex.value + scrollWindow + 1
    const length = cardList.value.length - 1
    return {
      start: Math.max(start, 0),
      end: Math.min(end, length),
    }
  })

  const activeCardList = computed(() => {
    return cardList.value.slice(slideWindow.value.start, slideWindow.value.end)
  })

  const cardNeighbours = computed(() => {
    const idx = cardIndex.value
    return {
      prev: cardList.value[idx - 1],
      current: cardList.value[idx],
      next: cardList.value[idx + 1],
    }
  })

  const activeCardOrder = computed(() => {
    return activeCardList.value.indexOf(cardNeighbours.value.current)
  })

  const pending = ref(false)
  const stopping = ref(false)

  const navgate = async (offset = 1) => {
    if (stopping.value) return
    if (offset > 0 && cardIndex.value >= cardList.value.length - 1) return
    if (offset < 0 && cardIndex.value <= 0) return
    return new Promise<void>((resolve) => {
      stopping.value = true
      cardIndex.value += offset
      leftOffset.value = (-offset)

      setTimeout(() => {
        pending.value = true
        leftOffset.value = 0

        nextTick(() => {
          setTimeout(() => {
            pending.value = false
            stopping.value = false
            resolve(undefined)
          }, 0)
        })
      }, 1000)
    })
  }

  onKeyStroke(['ArrowDown'], (e) => {
    e.preventDefault()
    navgate(1)
  })

  onKeyStroke(['ArrowUp'], (e) => {
    e.preventDefault()
    navgate(-1)
  })

  return { activeCardList, activeCardOrder, pending, cardNeighbours, navgate }
}

const { activeCardList, activeCardOrder, pending, cardNeighbours, navgate } = useCardScroll(cardIndex, cardList)

function useDymanicPath() {
  watch(() => cardNeighbours.value.current, (newVal) => {
    if (!newVal) return
    history.replaceState(history.state, '', `/explore/${newVal.id}`)
  }, { immediate: true })

  watch(show, (newVal) => {
    if (!newVal) {
      history.replaceState(history.state, '', '/explore')
    }
  })
}

useDymanicPath()

function handleClickCard(cardItem: VideoItem) {
  if (cardItem === cardNeighbours.value.current) return
  if (cardItem === cardNeighbours.value.prev) navgate(-1)
  if (cardItem === cardNeighbours.value.next) navgate(1)
}

</script>

<template>
  <Teleport to="body">

    <div
      v-if="show"
      class="fixed left-0 top-0 z-40 h-screen w-screen flex items-start justify-center bg-black bg-opacity-15"
    >
      <div
        class="fixed left-10 top-10 h-10 w-10 flex items-center justify-center border-2 rounded-full bg-white shadow transition-all hover:border-slate-300 hover:shadow-lg"
      >
        <div class="i-mdi-close-thick text-6 text-slate-600" @click="show = !show" />
      </div>

      <div
        ref="modalElement"
        class="feed-wrapper flex-col-center overflow-y-hidden overscroll-contain"
        :class="{ 'transition-transform': !pending }"
      >
        <template v-for="cardItem in activeCardList" :key="cardItem">
          <FeedContent
            class="feed-content"
            :info="cardItem"
            :active="cardNeighbours.current === cardItem"
            @active="handleClickCard(cardItem)"
          />
        </template>
      </div>
    </div>
  </Teleport>

</template>

<style scoped>
.feed-wrapper {
  --container-height: 100vh;
  --container-gap: 0vh;
}

@media (min-height: 875px) {
  .feed-wrapper {
    --container-height: 90vh;
    --container-gap: 2.5vh;
  }
}

@media (min-height: 1280px) {
  .feed-wrapper {
    --container-height: 80vh;
    --container-gap: 5vh;
  }
}

.feed-wrapper {
  gap: var(--container-gap);
  margin-top: calc(var(--container-gap) * 2);
  transform: translateY(calc(calc(var(--container-height) + var(--container-gap)) * v-bind(activeCardOrder) * -1));
  .feed-content {
    height: var(--container-height);
  }
}

</style>
