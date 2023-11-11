<script setup lang="ts">
import { cn } from '~/utils/css'

const inputElement = ref<HTMLElement | null>(null)

const focus = defineModel<boolean>('focus', { default: false })

const modelValue = defineModel<string | number | undefined>('modelValue')

</script>

<template>
  <input
    ref="inputElement"
    :value="modelValue"
    type="text"
    :class="cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', $attrs.class ?? '')"
    @input="modelValue = ($event.target as any).value"
    @blur="focus = false"
    @focus="focus = true"
  >
</template>
