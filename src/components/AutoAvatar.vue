<template>

  <div class="_auto_avatar relative">
    <div class="overflow-hidden rounded-full w-[80px] h-[80px] border-4 border-slate-900 shadow transition duration-300 ease-in-out _has_tranform">
      <img v-if="avatar" class="w-full h-full" :src="avatar" :alt="name" />

      <div v-else class="_auto-avatar w-full h-full flex justify-center items-center text-white text-2xl">
        {{ name[0] }}
      </div>

    </div>

    <span></span>
    <span></span>
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

._auto_avatar > span {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 50%;
  border: 2px solid #ffffff2b;
  opacity: 0;
}

@keyframes auto-avatar-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

._auto-avatar._talking > span {
  animation: auto-avatar-ring 800ms ease-in-out infinite;
}

</style>
