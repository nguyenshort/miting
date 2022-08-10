<template>
  <div class="relative">
    <div ref="video" class="videos-stream absolute w-full h-full z-10"></div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>

import {ICameraVideoTrack} from "agora-rtc-sdk-ng";
import {nextTick, onMounted, ref, watch} from "vue";

const props = defineProps<{
  source?: ICameraVideoTrack,
  play?: boolean
}>()

const video = ref<HTMLDivElement>()

onMounted(() => nextTick(() => {
  props.play && props.source?.play(video.value!, { fit: "cover", mirror: false })
}))

watch(() => props.source, (source) => {
  props.play && source?.play(video.value!)
})

</script>

<style scoped>

</style>
