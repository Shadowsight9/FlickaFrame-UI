import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { PlayHistory, SessionResponse, User } from '~/models'

export const usePlayHistoryStore = defineStore('playHistory', () => {
  const playHistory = ref(new Map<string, PlayHistory>())

  const create = (id: string, lastWatchedAt: number, total: number) => {
    playHistory.value.set(id, {
      videoId: id,
      progress: 0,
      total,
      consumed: 0,
      lastWatchedAt,
    })
  }

  const get = (id: string) => {
    return playHistory.value.get(id)
  }

  const update = (id: string, content: Partial<PlayHistory>) => {
    const history = playHistory.value.get(id)
    if (history) {
      playHistory.value.set(id, { ...history, ...content })
    }
  }

  const del = (id: string) => {
    playHistory.value.delete(id)
  }

  const cleanup = () => {
    playHistory.value = new Map<string, PlayHistory>()
  }
  return {
    cleanup,
    create,
    get,
    del,
    update,
  }
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
