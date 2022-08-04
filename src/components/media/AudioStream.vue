<template></template>

<script lang="ts" setup>
import {IAgoraRTCRemoteUser} from "agora-rtc-sdk-ng";
import {nextTick, onMounted, watch} from "vue";

const props = defineProps<{
  user: IAgoraRTCRemoteUser
}>()

onMounted(() => {
  props.user.audioTrack?.play()
})

watch(() => props.user.audioTrack, (track) => {
  nextTick(() => track?.play())
})

</script>
