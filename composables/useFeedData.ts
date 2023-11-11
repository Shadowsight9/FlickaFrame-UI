import type { VideoFeedQuery, VideoItem } from '~/models'
import { getVideoFeed } from '~/apis'

export function useFeedData(categoryId: Ref<string>, query: VideoFeedQuery = {}, fetchFn = getVideoFeed) {
  const feedListRecord = ref<Record<string, VideoItem[]>>({})
  const feedList = computed(() => feedListRecord.value[categoryId.value])

  const cursorRecord = ref<Record<string, string | undefined>>({})
  const cursor = computed(() => cursorRecord.value[categoryId.value])

  const isEndRecord = ref<Record<string, boolean>>({})
  const isEnd = computed(() => Boolean(isEndRecord.value[categoryId.value]))

  let isFresh = false

  const { refresh: addMore, pending } = useAsyncData(fetchFn.name, async () => {
    const currentId = categoryId.value
    const { success, data, msg } = await fetchFn({
      cursor: isFresh ? undefined : cursor.value,
      limit: 20,
      categoryId: currentId,
      ...query,
    })

    if (!success) {
      message.error(`获取视频列表失败: ${msg}`)
      return
    }

    cursorRecord.value[currentId] = data.next
    isEndRecord.value[currentId] = data.isEnd || data.list.length === 0

    if (!feedListRecord.value[currentId] || isFresh) {
      feedListRecord.value[currentId] = []
    }
    feedListRecord.value[currentId].push(...data.list)
  }, { watch: [categoryId] })

  const refresh = async () => {
    isFresh = true
    await addMore()
    isFresh = false
  }

  return { feedList, isEnd, addMore, pending, refresh }
}
