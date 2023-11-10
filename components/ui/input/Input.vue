<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { cn } from '~/utils/css'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  isFocus?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
  (e: 'update:isFocus', payload: boolean): void
}>()

const inputElement = ref<HTMLElement | null>(null)

const isFocus = computed({
  get: () => {
    if (props.isFocus && inputElement.value) {
      inputElement.value.focus()
    }
    return props.isFocus
  },
  set: value => emits('update:isFocus', value),
})

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

</script>

<template>
  <input
    ref="inputElement"
    :value="modelValue"
    type="text"
    :class="cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', $attrs.class ?? '')"
    @input="modelValue = ($event.target as any).value"
    @blur="isFocus = false"
    @focus="isFocus = true"
  >
</template>
