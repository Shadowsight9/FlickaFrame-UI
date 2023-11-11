<script setup lang="ts">
const isDark = useDark()
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger class="w-full">
      <UiButton
        variant="ghost"
        size="lg"
        class="w-full justify-start"
      >
        <div class="i-mdi-settings mr-2 text-xl" />
        设置
      </UiButton>

    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent>

      <UiDropdownMenuItem>
        <UiSwitch @click.stop="isDark = !isDark" />
        <div
          class="ml-2 text-lg"
          :class="isDark ? 'i-mdi-weather-night' : 'i-mdi-weather-sunny'"
        />

      </UiDropdownMenuItem>

    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
