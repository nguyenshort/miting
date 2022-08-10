<template>
  <div class="bg-gray-100 rounded-xl overflow-hidden">

    <div
        class="w-full h-full"
    >
      <video-streamer
          class="w-full h-full"
          :source="mainStore.localTracks.videoTrack"
          :play="true"
      />
    </div>

    <div v-if="false">
      <audio-streamer
          v-for="user in mainStore.users"
          :key="user.uid"
          :source="user.audioTrack"
      ></audio-streamer>
    </div>

  </div>

</template>

<script lang="ts" setup>
import {nextTick, onMounted} from "vue"
import {useMainStore} from "../stores/main";

const mainStore = useMainStore()

const initAgora = async () => {
  mainStore.client = window.AgoraRTC.createClient({
    codec: 'h264',
    mode: 'rtc'
  })

  const [audio, camera] = await window.AgoraRTC.createMicrophoneAndCameraTracks()
  mainStore.localTracks.audioTrack = audio
  mainStore.localTracks.videoTrack = camera


  // init camera
}

onMounted(() => nextTick(() => initAgora()))
</script>

<style scoped>

</style>
