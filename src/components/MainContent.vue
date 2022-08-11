<template>
  <div
      ref="elRef"
  >

    <div
        id="auto-grid"
        class="w-full h-full scrollbar-hide"
        :class="[mainStore.settings.playMode, mainStore.settings.pinner ? 'focused' : '']"
    >
      <video-streamer
          class="w-full h-full"
          :source="mainStore.localTracks.videoTrack"
          :class="{
             _focus: mainStore.focused === mainStore.currentUser?.id
          }"
          :uid="mainStore.currentUser?.id"
          :play="true"
      />

      <video-streamer
          v-for="(track, index) in mainStore.users"
          class="w-full h-full"
          :key="track.uid"
          :source="track.videoTrack"
          :play="true"
          :uid="track.uid"
          :class="{
             _focus: mainStore.focused === track.uid
          }"
      />
    </div>

    <div>
      <audio-streamer
          v-for="user in mainStore.users"
          :key="user.uid"
          :source="user.audioTrack"
      ></audio-streamer>
    </div>

  </div>

</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, ref} from "vue"
import {useMainStore} from "../stores/main";
import {useElementSize} from "@vueuse/core";

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

const elRef = ref<HTMLDivElement>()
const { height } = useElementSize(elRef)
const gridAuto = computed(() => {
  return `minmax(${(height.value - 15)/2}px, auto)`
})
</script>

<style scoped>

#auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
#auto-grid.auto {
  grid-template-columns: 100%;
}

#auto-grid.auto > ._focus, #auto-grid.manual > ._focus {
  order: 1;
}
#auto-grid.auto > div:not(._focus), #auto-grid.manual.focused > div:not(._focus) {
  display: none;
  order: 2;
}

#auto-grid.grids, #auto-grid.manual {
  grid-gap: 15px;
  max-height: 100%;
  overflow-y: auto;
  height: 100%;
  grid-auto-rows: v-bind(gridAuto);
}
</style>
