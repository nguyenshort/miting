<template>
  <button
      class="aspect-1 overflow-hidden flex items-center justify-center hover:shadow hover:bg-primary-500 hover:shadow-primary-300 rounded-lg transition transform disabled:opacity-50 disabled:pointer-events-none"
      :class="{
          'scale-105 bg-primary-500 text-white _action': active,
          'bg-gray-100 text-gray-500 hover:text-white': !active,
      }"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
import {computed} from "vue";

const props = withDefaults(defineProps<{
  active?: boolean,
  size?: number
}>(), {
  active: false,
  size: 32,
})

const size = computed(() => props.size + 'px')
</script>

<style scoped>
button {
  width: v-bind(size);
  height: v-bind(size);
}
</style>
