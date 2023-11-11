import type { VideoItem } from '~/models'
import { getVideoFeed } from '~/apis'

export function useCursorData(fetchFn = getVideoFeed) {
  const dataList = ref<VideoItem[]>([])

  const cursor = ref<string>('')

  const isEnd = ref<boolean>(false)

  const { refresh: addMore, pending } = useAsyncData(fetchFn.name, async () => {
    const { success, data, msg } = await fetchFn({
      cursor: cursor.value,
      limit: 20,
    })

    if (!success) {
      message.error(`获取列表失败: ${msg}`)
      return
    }

    cursor.value = data.next
    isEnd.value = data.isEnd || data.list.length === 0

    dataList.value.push(...data.list)
  })

  return { dataList, isEnd, addMore, pending }
}
