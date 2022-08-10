<template>
  <button
      class="aspect-1 overflow-hidden flex items-center justify-center rounded-lg transition transform"
      :class="{
          'scale-105 bg-red-500 text-white hover:shadow hover:shadow-rose-300': active,
          'bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white': !active,
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
