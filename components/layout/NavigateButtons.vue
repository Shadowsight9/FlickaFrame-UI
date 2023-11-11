<script setup lang="ts">
interface MenuItem {
  icon: string
  text: string
  path?: string
  external?: boolean
  show?: boolean
  render?: () => JSX.Element
}

const props = defineProps<{
  menus: MenuItem[]
}>()

const route = useRoute()

function navigate(item: MenuItem) {
  navigateTo(item.path, {
    external: item.external,
    open: item.external ? { target: '_blank' } : undefined,
  })
}

</script>

<template>
  <div class="space-y-2">

    <template
      v-for="item in props.menus"
      :key="item.text"
    >
      <UiButton
        v-if="item.show !== false && !item.render"
        :variant="route.path === item.path ? 'secondary' : 'ghost'"
        size="lg"
        class="w-full justify-start"
        @click="navigate(item)"
      >
        <div class="mr-2 text-xl" :class="item.icon" />
        {{ item.text }}
      </UiButton>
      <component
        :is="item.render"
        v-if="item.show !== false && item.render"
      />

    </template>

  </div>

</template>
