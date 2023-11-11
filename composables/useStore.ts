import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { PlayHistory, SessionResponse, User } from '~/models'

export const usePlayHistoryStore = defineStore('playHistory', () => {
  const playHistory = ref<Record<string, PlayHistory>>({})

  const create = (id: string, total: number) => {
    if (playHistory.value[id]) return
    playHistory.value[id] = {
      videoId: id,
      total,
      consumed: 0,
      lastWatchedAt: dayjs().unix(),
    }
  }

  const get = (id: string) => {
    return playHistory.value[id]
  }

  const stop = (id: string, lastProgress?: number) => {
    const history = get(id)
    if (!history?.lastPlayedAt) return

    const consumed = dayjs().unix() - history.lastWatchedAt + history.consumed

    playHistory.value[id] = {
      ...history,
      consumed,
      lastProgress,
      lastPlayedAt: undefined,
    }
  }

  const start = (id: string) => {
    const history = get(id)
    if (!history) return
    if (history.lastPlayedAt) return

    playHistory.value[id] = {
      ...history,
      lastPlayedAt: dayjs().unix(),
    }
  }

  const del = (id: string) => {
    if (!playHistory.value[id]) return
    delete playHistory.value[id]
  }

  const cleanup = () => {
    playHistory.value = {}
  }

  return {
    playHistory,
    cleanup,
    create,
    get,
    del,
    start,
    stop,
  }
}, {
  persist: true,
})

export const useSessionStore = defineStore('session', () => {
  const session = ref<Partial<SessionResponse>>({ })

  const user = ref<Partial<User>>({ })

  const historyStore = usePlayHistoryStore()

  const cleanup = () => {
    session.value = {}
    user.value = {}
    historyStore.cleanup()
  }

  const isSessionModalOpen = ref(false)

  const isLogin = computed(() => {
    return !!session.value.accessExpire && dayjs().unix() < session.value.accessExpire
  })

  return {
    cleanup,
    isLogin,
    session,
    user,
    isSessionModalOpen,
  }
}, {
  persist: true,
})

export const useFollowChange = defineStore('followChangeset', () => {
  return useChangeSet<string, boolean>()
})

export const useLikeChange = defineStore('likeChangeset', () => {
  return useChangeSet<string, boolean>()
})
