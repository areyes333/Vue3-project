<template>
  <div :class="{
         'block w-full': block,
         'inline-flex': !block,
         'shadow-sm': !variant.includes('link'),
         [customClass]: customClass
        }"
       class="relative"
  >
    <button v-bind="$attrs"
            :type="type"
            :disabled="disabled || loading"
            ref="button"
            class="base-button items-center justify-center border border-transparent rounded-md shadow-sm font-medium focus:outline-none focus:ring-gray-600 focus:border-gray-600 transition ease-in-out duration-150"
            :class="{
                  'text-white bg-blue-600 hover:bg-blue-700': variant === 'primary',
                  'text-xs px-2.5 py-1.5 leading-4': size === 'xs',
                  'text-sm px-4 py-2 leading-4': size === 'sm',
                  'text-sm px-5 py-2 leading-5': size === 'md',
                  'text-base px-6 py-4 leading-6': size === 'lg',
                  'text-base px-8 py-4 leading-6': size === 'xl',
                  'opacity-50 cursor-not-allowed': disabled || loading,
                  'inline-flex': !block,
                  'w-full flex justify-center': block,
                }"
    >
        <span v-if="loading"
              class="absolute flex w-full items-center justify-center">
            <LoadingIcon :size="size"/>
        </span>

      <span class="flex flex-wrap items-center"
            :class="{'opacity-0': loading}"
      >
            <slot></slot>
        </span>
    </button>
  </div>
</template>
<script lang="ts">
import LoadingIcon from "@/components/common/buttons/LoadingIcon.vue";
import { defineComponent, PropType } from "vue";

type ButtonType = "button" | "submit" | "reset" | undefined

export default defineComponent({
  inheritAttrs: false,
  components: {
    LoadingIcon,
  },
  props: {
    block: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      default: 'primary'
    },
    type: {
      type: String as PropType<ButtonType>,
      default: 'button',
    },
    size: {
      type: String,
      default: 'md' // xs|sm|md|lg|xl
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  methods: {
    focus() {
      this.$refs.button?.focus()
    }
  },
})
</script>
<style lang="scss" scoped>
.base-button {
  &:focus {
    @apply ring-1 ring-blue-500;
  }
}
</style>
