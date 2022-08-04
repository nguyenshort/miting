<template>
  <div class="h-screen w-full flex items-center justify-center bg-slate-800 flex-col">
    <vue-lottie-player
        width='250px'
        height='200px'
        loop
        path="https://assets10.lottiefiles.com/packages/lf20_4jsnlwpe.json"
    />
    <p class="text-white text-xs mt-4">Bạn đã bị kích ra khỏi phòng</p>
  </div>
</template>

<script lang="ts" setup>

import {inject, onMounted} from "vue";
import {IUseAgora} from "../../composables/useAgora";
import {RoomStatus, useRoomStore} from "../../stores/room";

const { localData, client } = inject<IUseAgora>('ROOM_PROVIDER')!

const roomStore = useRoomStore()

onMounted(async () => {
  await client.leave()
  localData.videoTrack?.close()
  localData.audioTrack?.close()
})

</script>

<style scoped>

</style>
