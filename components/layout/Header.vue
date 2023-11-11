<script setup>
import Logo from '~/assets/logo.png'

const store = useSessionStore()

function handleLogout() {
  store.clearSession()
  message.info('退出登录成功')
}

const text = ref('')

function handleSearch() {
  if (!text.value) return
  navigateTo({
    name: 'search',
    query: { q: text.value },
  })
}

const isDark = useDark()
// const toggleDark = useToggle(isDark)

</script>

<template>

  <nav class="flex items-center justify-between gap-2 border-b border-slate px-4">
    <img :src="Logo" alt="logo" class="w-80">

    <UiInput
      v-model="text"
      class="h-12 max-w-240 text-base"
      placeholder="搜索框，搜你想搜"
      @keyup.enter="handleSearch"
    />

    <UiDropdownMenu v-if="store.user.userId">
      <UiDropdownMenuTrigger>
        <UiButton variant="secondary" class="mr-4 flex-center gap-2 whitespace-nowrap py-7 text-base">
          <UiAvatar size="base">
            <UiAvatarImage :src="store.user.avatarUrl" :alt="store.user.nickName" />
            <UiAvatarFallback>{{ store.user.nickName }}</UiAvatarFallback>
          </UiAvatar>
          {{ store.user.nickName }}
        </UiButton>
      </UiDropdownMenuTrigger>
      <UiDropdownMenuContent>
        <UiDropdownMenuLabel> {{ store.user.nickName }}</UiDropdownMenuLabel>
        <UiDropdownMenuSeparator />
        <UiDropdownMenuItem @click="navigateTo(`/profile/${store.user.userId}`)">我的频道</UiDropdownMenuItem>
        <UiDropdownMenuItem @click="handleLogout">退出登录</UiDropdownMenuItem>
      </UiDropdownMenuContent>
    </UiDropdownMenu>

    <UiButton
      v-else
      variant="secondary"
      class="mr-4 whitespace-nowrap border py-4 text-sm"
      @click="store.isSessionModalOpen = true"
    >
      点击登录

    </UiButton>

    <UiToggle @click="isDark = !isDark">dsadsa</UiToggle>
    <UserSessionModal v-model="store.isSessionModalOpen" />

  </nav>
</template>
