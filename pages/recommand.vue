<script setup lang="ts">
import { Swiper } from 'swiper/vue'
import type { Swiper as TSwiper } from 'swiper'
import { ALL_CATEGORY } from '~/models'

definePageMeta({
  keepalive: true,
})

const { feedList, addMore } = useFeedData(ref(ALL_CATEGORY))

const swiperInstance = ref<TSwiper>()
const activeInstance = ref<number>()

onKeyStroke(['ArrowUp'], () => {
  swiperInstance.value?.slidePrev()
  activeInstance.value = swiperInstance.value?.activeIndex
})

onKeyStroke(['ArrowDown'], () => {
  swiperInstance.value?.slideNext()
  activeInstance.value = swiperInstance.value?.activeIndex
})

watch(activeInstance, (val) => {
  if (!val) return
  if (val + 2 < feedList.value.length) {
    addMore()
  }
})

function onSwiper(swiper: TSwiper) {
  swiperInstance.value = swiper
}

</script>

<template>
  <div class="h-full w-full">
    <Swiper
      class="h-full"
      :modules="[SwiperVirtual]"
      :slides-per-view="1"
      direction="vertical"
      virtual
      @swiper="onSwiper"
    >
      <SwiperSlide v-for="item in feedList" :key="item.id">
        <FeedContent
          :card="false"
          :info="item"
        />
      </SwiperSlide>
    </Swiper>

  </div>

</template>
