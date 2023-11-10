<script setup lang="ts">
import { AvatarRoot } from 'radix-vue'

import { cn } from '~/utils/css'
import { cva } from 'class-variance-authority'

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
  shape: 'circle',
})

const avatarVariant = cva(
  'inline-flex items-center justify-center font-normal text-foreground select-none shrink-0 bg-secondary overflow-hidden',
  {
    variants: {
      size: {
        sm: 'h-5 w-5 text-xs',
        base: 'h-10 w-10',
        lg: 'h-14 w-14 text-lg',
        xl: 'h-40 w-40 text-xl',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-md',
      },
    },
  },
)

interface Props {
  size?: NonNullable<Parameters<typeof avatarVariant>[0]>['size']
  shape?: NonNullable<Parameters<typeof avatarVariant>[0]>['shape']
  class?: string
}

</script>

<template>
  <AvatarRoot :class="cn(avatarVariant({ size, shape }), props.class)">
    <slot />
  </AvatarRoot>
</template>
