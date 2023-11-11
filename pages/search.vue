<script setup lang="ts">
import type { VideoSearchResponse } from '~/models'
import { getVideoFeed, searchVideo } from '~/apis'

const route = useRoute()

const query = computed(() => route.query.q as string)

const tagName = computed(() => route.query.tname as string)
const tagId = computed(() => route.query.tid as string)
const { data, pending, refresh } = useAsyncData(async () => {
  if (query.value) {
    const { data } = await searchVideo({
      keyword: query.value,
      limit: 20,
      offset: 0,
    })
    return data
  } else if (tagId) {
    const { data } = await getVideoFeed({
      tag: tagId.value,
      limit: 20,
    })
    return data as unknown as VideoSearchResponse
  }
}, { watch: [query] })

</script>

<template>
  <div v-if="data">
    <h1 class="p-10 text-xl">
      <template v-if="query">
        {{ `⚡️⚡️ 在 ${data.processingTimeMs} ms 内找到了关于 ${data.query} 的 ${data.estimatedTotalHits} 个结果：` }}
      </template>
      <template v-else>
        {{ `⚡️⚡️ 找到了关于#${tagName} 的 ${data.list.length} 条结果` }}
      </template>

    </h1>
    <div>
      <FeedActivity
        v-for="item in data.list"
        :key="item.id"
        :info="item"
        raw
      />
    </div>

  </div>
  <div v-else>
    Loading: {{ data }}
  </div>

</template>
