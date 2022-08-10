<template>
  <div class="w-8/12 px-5">

    <div class="w-full h-full flex flex-col">

      <user-slide v-if="inRom" ref="slideRef" class="flex-shrink-0" />

      <div v-else class="h-5"></div>

      <main-content
          id="home-body"
          ref="bodyRef"
          class="h-auto flex-shrink-0"
          :style="{ height: heightBody }"
      />

      <navigation-bar ref="bottomRef" />

    </div>

  </div>

  <div class="w-4/12">
    <sidebar-view />
  </div>
</template>

<script lang="ts" setup>
import {useElementSize, useWindowSize} from "@vueuse/core";
import {computed, ref} from "vue";

import {useMainStore} from "../../stores/main";
const mainStore = useMainStore()

const inRom = computed(() => {
  return mainStore.roomStatus === 'join'
})

const { height } = useWindowSize()

const slideRef = ref<HTMLDivElement>()
const { height: heighSlide } = useElementSize(slideRef)

const bodyRef = ref<HTMLDivElement>()
const bottomRef = ref<HTMLDivElement>()
const { height: heighBottom } = useElementSize(bottomRef)

const heightContainer = computed(() => {
  return (height.value - 60) + 'px'
})

/**
 * Trừ 70 đầu, slide + bottom
 */
const heightBody = computed(() => {
  if(inRom.value) {
    return (height.value - heighSlide.value - heighBottom.value - 70) + 'px'
  } else {
    return (height.value - heighBottom.value - 70 - 20) + 'px'
  }
})
</script>

<style scoped>

</style>
