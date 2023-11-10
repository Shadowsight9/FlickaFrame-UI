import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { SessionResponse, User } from '~/models'

export const useSessionStore = defineStore('session', () => {
  const session = ref<Partial<SessionResponse>>({ })

  const user = ref<Partial<User>>({ })

  const clearSession = () => {
    session.value = {}
    user.value = {}
  }

  const isSessionModalOpen = ref(false)

  const isLogin = computed(() => {
    return !!session.value.accessExpire && dayjs().unix() < session.value.accessExpire
  })

  return {
    clearSession,
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
