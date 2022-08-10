<template></template>

<script lang="ts" setup>
import {IMicrophoneAudioTrack} from "agora-rtc-sdk-ng";
import {nextTick, onMounted, watch} from "vue";

const props = defineProps<{
  source?: IMicrophoneAudioTrack
}>()

onMounted(() => {
  props.source?.play()
})

watch(() => props.source, (track) => {
  nextTick(() => track?.play())
})
</script>
<style scoped></style>
