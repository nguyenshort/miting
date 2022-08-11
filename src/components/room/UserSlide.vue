<template>
  <div class="flex overflow-x-auto scrollbar-hide py-5">

    <video-streamer
        class="w-[200px] h-[120px] bg-gray-100 rounded-md flex-shrink-0 mr-5 last:mr-0 overflow-hidden relative"
        :key="mainStore.currentUser?.id"
        :source="mainStore.localTracks.videoTrack"
        :uid="mainStore.currentUser?.id"
        :play="false"
    >

    </video-streamer>

    <video-streamer
        v-for="(source, index) in mainStore.users"
        class="w-[200px] h-[120px] bg-gray-100 rounded-md flex-shrink-0 mr-5 last:mr-0 overflow-hidden relative"
        :key="source.uid"
        :source="source.videoTrack"
        :uid="source.uid"
        :play="false"
    >
    </video-streamer>
  </div>
</template>

<script lang="ts" setup>
import {useMainStore} from "../../stores/main";

const mainStore = useMainStore()
</script>

<style scoped>

</style>
