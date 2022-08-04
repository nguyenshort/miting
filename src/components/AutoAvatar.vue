<template>

  <div class="overflow-hidden rounded-full w-[80px] h-[80px] border-4 border-slate-900 shadow transition duration-300 ease-in-out _has_tranform _auto_avatar">
    <img v-if="avatar" class="w-full h-full" :src="avatar" :alt="name" />

    <div v-else class="_auto-avatar w-full h-full flex justify-center items-center text-white text-2xl">
      {{ name[0] }}
    </div>

  </div>

</template>

<script lang="ts" setup>

import {computed} from "vue";

const props = defineProps<{
  avatar?: string
  name: string,
}>()

const color = computed(() => {
  return '#' + Math.floor(Math.random()*16777215).toString(16)
})

</script>

<style scoped>

._auto-avatar {
  background: v-bind(color);
}

</style>
