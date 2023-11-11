<script setup lang='tsx'>
import LayoutSetting from './Setting.vue'

const store = useSessionStore()

const menu = computed(() => {
  return [
    {
      text: '探索',
      sumMenus: [
        { icon: 'i-mdi-home', text: '发现', path: '/explore' },
        { icon: 'i-mdi-movie-open-star-outline', text: '推荐', path: '/recommand' },
        { icon: 'i-mdi-account-star', text: '关注', path: '/subscribe', show: store.isLogin },
        { icon: 'i-mdi-weather-hurricane-outline', text: '最热', path: '/hot' },
      ],
    },
    {
      text: '我的',
      emptyHint: '登录后查看更多',
      sumMenus: [
        { icon: 'i-mdi-post', text: '创作', path: '/post', show: store.isLogin },
        { icon: 'i-mdi-laptop-account', text: '我的频道', path: `/profile/${store.user.userId}`, show: store.isLogin },
        { icon: 'i-mdi-history', text: '历史记录', path: '/history', show: store.isLogin },
        { icon: 'i-mdi-account-heart-outline', text: '赞过', path: '/favorite', show: store.isLogin },
        { icon: 'i-mdi-message-alert-outline', text: '通知', path: '/notify', show: store.isLogin },
      ],
    },
  ]
})

const fixedMenus = [
  { icon: 'i-mdi-settings', text: '设置', render: () => <LayoutSetting /> },
  { icon: 'i-mdi-progress-question', text: '帮助', path: 'https://nmffrqogqd.feishu.cn/docx/U89TdCNMNommKdxmurQcmSV7nAg', external: true },
  { icon: 'i-mdi-feedback', text: '发送反馈', path: 'https://github.com/FlickaFrame', external: true },
]

</script>

<template>
  <nav class="flex flex-col gap-4 p-4">
    <div
      v-for="menuItem in menu"
      :key="menuItem.text"
      class="px-3 py-2"
    >
      <h2 class="mb-2 select-none px-4 text-xl font-semibold tracking-tight text-primary">
        {{ menuItem.text }}
      </h2>
      <LayoutNavigateButtons :menus="menuItem.sumMenus" />

    </div>
    <div class="flex-1" />

    <UiSeparator class="bg-foreground/20" />

    <LayoutNavigateButtons :menus="fixedMenus" />
  </nav>
</template>
