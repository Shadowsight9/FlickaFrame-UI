interface FetchFnQuery {
  cursor: string
  limit: number
}

type FetchFn<T> = (q?: FetchFnQuery) => Promise<ApiResult<{
  next: string
  list: T[]
  isEnd: boolean
}>>

export function useCursorData<T>(fetchFn: FetchFn<T>) {
  const dataList = ref<T[]>([])

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

    // @ts-expect-error
    dataList.value.push(...data.list)
  })

  return { dataList, isEnd, addMore, pending }
}
