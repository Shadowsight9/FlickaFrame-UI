import type { VideoItem } from '~/models'
import { getVideoFeed } from '~/apis'

export function useFeedData(categoryId: Ref<number>, limit = 20) {
  const feedListRecord = ref<Record<number, VideoItem[]>>([])
  const feedList = computed(() => feedListRecord.value[categoryId.value])

  const cursorRecord = ref<Record<number, string | undefined>>({})
  const cursor = computed(() => cursorRecord.value[categoryId.value])

  const isEndRecord = ref<Record<number, boolean>>({})
  const isEnd = computed(() => isEndRecord.value[categoryId.value])

  const { refresh, pending } = useAsyncData(async () => {
    const currentId = categoryId.value
    const { success, data, msg } = await getVideoFeed({
      cursor: cursor.value,
      limit,
      categoryId: currentId,
    })

    if (!success) {
      message.error(`获取视频列表失败: ${msg}`)
      return
    }

    cursorRecord.value[currentId] = data.next
    isEndRecord.value[currentId] = data.isEnd

    if (!feedListRecord.value[currentId]) {
      feedListRecord.value[currentId] = []
    }
    feedListRecord.value[currentId].push(...data.list)
  }, { watch: [categoryId], immediate: true })

  return { feedList, isEnd, refresh, pending }
}