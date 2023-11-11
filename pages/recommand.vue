<script setup lang="ts">
import { Swiper } from 'swiper/vue'
import type { Swiper as TSwiper } from 'swiper'
import { ALL_CATEGORY } from '~/models'

definePageMeta({
  keepalive: true,
})

const { feedList, isEnd, addMore, pending } = useFeedData(ref(ALL_CATEGORY))

const swiperInstance = ref<TSwiper>()

onKeyStroke(['w', 'ArrowUp'], () => {
  swiperInstance.value?.slidePrev()
})

onKeyStroke(['s', 'ArrowDown'], () => {
  swiperInstance.value?.slideNext()
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
