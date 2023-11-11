<script setup lang="ts">
import type { ToggleEmits, ToggleProps } from 'radix-vue'
import { Toggle, useForwardPropsEmits } from 'radix-vue'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { computed } from 'vue'
import { cn } from '~/utils/css'

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
})

const emits = defineEmits<ToggleEmits>()

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ToggleVariantProps extends VariantProps<typeof toggleVariants> {}

interface Props extends ToggleProps {
  variant?: ToggleVariantProps['variant']
  size?: ToggleVariantProps['size']
  disabled?: boolean
}
const toggleProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant, size, disabled, ...otherProps } = props
  return otherProps
})

const forwarded = useForwardPropsEmits(toggleProps, emits)
</script>

<template>
  <Toggle
    v-bind="forwarded"
    :class="cn(toggleVariants({ variant, size, class: $attrs.class ?? '' }))"
    :disabled="props.disabled"
  >
    <slot />
  </Toggle>
</template>
