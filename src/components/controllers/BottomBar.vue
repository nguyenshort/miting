<template>
  <div class="h-20 w-full flex-shrink-0 bg-slate-800 relative flex items-center justify-center">

    <div class="absolute top-1/2 left-7 text-white text-[16px] transform -translate-y-1/2">
      {{ current.format('hh:mm') }} <span class="px-2">|</span> Smileeye
    </div>


    <button
        class="text-white w-[40px] h-[40px] flex items-center justify-center rounded-full transition duration-300 ease-in-out"
        :class="{
          'bg-slate-900': userMedia.audio,
          'bg-rose-600': !userMedia.audio
        }"
        @click="toggleAudio"
    >
      <svg v-if="userMedia.audio" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" class="fill-current" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 448h128M384 208v32c0 70.4-57.6 128-128 128h0c-70.4 0-128-57.6-128-128v-32M256 368v80"/><path d="M256 64a63.68 63.68 0 00-64 64v111c0 35.2 29 65 64 65s64-29 64-65V128c0-36-28-64-64-64z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>

      <svg v-else xmlns="http://www.w3.org/2000/svg"  width="24px" height="24px" class="fill-current" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M432 400L96 64"/><path d="M400 240v-31.55c0-8.61-6.62-16-15.23-16.43A16 16 0 00368 208v32a111.58 111.58 0 01-2.45 23.31 4.05 4.05 0 001.07 3.69l21.82 21.81a2 2 0 003.29-.72A143.27 143.27 0 00400 240zM256 352a112.36 112.36 0 01-112-112v-31.55c0-8.61-6.62-16-15.23-16.43A16 16 0 00112 208v32c0 74 56.1 135.12 128 143.11V432h-47.55c-8.61 0-16 6.62-16.43 15.23A16 16 0 00192 464h127.55c8.61 0 16-6.62 16.43-15.23A16 16 0 00320 432h-48v-48.89a143.08 143.08 0 0052-16.22 4 4 0 00.91-6.35L307 342.63a4 4 0 00-4.51-.78A110.78 110.78 0 01256 352zM256 80a47.18 47.18 0 0148 48v74.72a4 4 0 001.17 2.82L332.59 233a2 2 0 003.41-1.42V128.91C336 85 301 48.6 257.14 48a79.66 79.66 0 00-68.47 36.57 4 4 0 00.54 5l19.54 19.54a2 2 0 003.25-.63A47.44 47.44 0 01256 80z"/><path d="M207.27 242.9L179.41 215a2 2 0 00-3.41 1.42V239a80.89 80.89 0 0023.45 56.9 78.55 78.55 0 0077.8 21.19 2 2 0 00.86-3.35l-24.91-24.91a4.08 4.08 0 00-2.42-1.15c-21.65-2.52-39.48-20.44-42.37-42.43a4 4 0 00-1.14-2.35z"/></svg>

    </button>

    <div class="w-5"></div>

    <button
        class="text-white w-[40px] h-[40px] flex items-center justify-center rounded-full transition duration-300 ease-in-out"
        :class="{
          'bg-slate-900': userMedia.video,
          'bg-rose-600': !userMedia.video
        }"
        @click="toggleVideo"
    >
      <svg  v-if="userMedia.video" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" class="fill-current" viewBox="0 0 512 512"><path d="M374.79 308.78L457.5 367a16 16 0 0022.5-14.62V159.62A16 16 0 00457.5 145l-82.71 58.22A16 16 0 00368 216.3v79.4a16 16 0 006.79 13.08z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M268 384H84a52.15 52.15 0 01-52-52V180a52.15 52.15 0 0152-52h184.48A51.68 51.68 0 01320 179.52V332a52.15 52.15 0 01-52 52z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/></svg>

      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" class="fill-current" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="32" stroke-linejoin="round" d="M374.79 308.78L457.5 367a16 16 0 0022.5-14.62V159.62A16 16 0 00457.5 145l-82.71 58.22A16 16 0 00368 216.3v79.4a16 16 0 006.79 13.08z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="32" stroke-miterlimit="10" d="M50.19 140.57A51.94 51.94 0 0032 180v152a52.15 52.15 0 0052 52h184a51.6 51.6 0 0022-4.9M208 128h60.48A51.68 51.68 0 01320 179.52V248M416 416L80 80"/></svg>

    </button>

    <div class="w-5"></div>


    <button
        class="text-white w-[38px] h-[38px] flex items-center justify-center rounded-full transition duration-300 ease-in-out bg-rose-600"
        @click="onLeaveClick"
    >
      <svg style="transform: rotate(138deg);" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" class="fill-current" viewBox="0 0 512 512"><path d="M451 374c-15.88-16-54.34-39.35-73-48.76-24.3-12.24-26.3-13.24-45.4.95-12.74 9.47-21.21 17.93-36.12 14.75s-47.31-21.11-75.68-49.39-47.34-61.62-50.53-76.48 5.41-23.23 14.79-36c13.22-18 12.22-21 .92-45.3-8.81-18.9-32.84-57-48.9-72.8C119.9 44 119.9 47 108.83 51.6A160.15 160.15 0 0083 65.37C67 76 58.12 84.83 51.91 98.1s-9 44.38 23.07 102.64 54.57 88.05 101.14 134.49S258.5 406.64 310.85 436c64.76 36.27 89.6 29.2 102.91 23s22.18-15 32.83-31a159.09 159.09 0 0013.8-25.8C465 391.17 468 391.17 451 374z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/></svg>
    </button>



    <div class="absolute top-1/2 right-7 text-[16px] transform -translate-y-1/2 flex items-center">

      <button class="text-white relative" @click="roomStore.setCurrentTab('users')">

        <div class="absolute top-0 right-0 text-[11px] transform translate-x-1/2 -translate-y-1/2 py-0.5 px-1.5 rounded-full bg-[#0f172ac4]">
          {{ usersData.length }}
        </div>

        <svg width="24px" height="24px" class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M402 168c-2.93 40.67-33.1 72-66 72s-63.12-31.32-66-72c-3-42.31 26.37-72 66-72s69 30.46 66 72z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M336 304c-65.17 0-127.84 32.37-143.54 95.41-2.08 8.34 3.15 16.59 11.72 16.59h263.65c8.57 0 13.77-8.25 11.72-16.59C463.85 335.36 401.18 304 336 304z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path d="M200 185.94c-2.34 32.48-26.72 58.06-53 58.06s-50.7-25.57-53-58.06C91.61 152.15 115.34 128 147 128s55.39 24.77 53 57.94z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M206 306c-18.05-8.27-37.93-11.45-59-11.45-52 0-102.1 25.85-114.65 76.2-1.65 6.66 2.53 13.25 9.37 13.25H154" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32"/></svg>
      </button>

      <button class="text-white ml-6" @click="roomStore.setCurrentTab('chat')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" class="fill-current" viewBox="0 0 512 512"><path d="M431 320.6c-1-3.6 1.2-8.6 3.3-12.2a33.68 33.68 0 012.1-3.1A162 162 0 00464 215c.3-92.2-77.5-167-173.7-167-83.9 0-153.9 57.1-170.3 132.9a160.7 160.7 0 00-3.7 34.2c0 92.3 74.8 169.1 171 169.1 15.3 0 35.9-4.6 47.2-7.7s22.5-7.2 25.4-8.3a26.44 26.44 0 019.3-1.7 26 26 0 0110.1 2l56.7 20.1a13.52 13.52 0 003.9 1 8 8 0 008-8 12.85 12.85 0 00-.5-2.7z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32"/><path d="M66.46 232a146.23 146.23 0 006.39 152.67c2.31 3.49 3.61 6.19 3.21 8s-11.93 61.87-11.93 61.87a8 8 0 002.71 7.68A8.17 8.17 0 0072 464a7.26 7.26 0 002.91-.6l56.21-22a15.7 15.7 0 0112 .2c18.94 7.38 39.88 12 60.83 12A159.21 159.21 0 00284 432.11" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32"/></svg>
      </button>

      <button class="text-white ml-6" @click="roomStore.setCurrentTab('info')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" class="fill-current" viewBox="0 0 512 512"><path d="M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184 184-82.39 184-184S349.61 64 248 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M220 220h32v116"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M208 340h88"/><path d="M248 130a26 26 0 1026 26 26 26 0 00-26-26z"/></svg>
      </button>
    </div>

  </div>
</template>

<script lang="ts" setup>

import {inject, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import dayjs from "dayjs";
import {RoomStatus, useRoomStore} from "../../stores/room"
import {IAgoraRTCClient} from "agora-rtc-sdk-ng";
import {AGORA_CONSTANT} from "../../plugins/rtc";
import {IUseAgora} from "../../composables/useAgora";

const client = inject<IAgoraRTCClient>(AGORA_CONSTANT)!
const { localData, usersData } = inject<IUseAgora>('ROOM_PROVIDER')!

const roomStore = useRoomStore()

const current = ref(dayjs())

let timer = ref()

onMounted(() => {
  timer.value = setInterval(() => {
    current.value = dayjs()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer.value)
})

const userMedia = reactive({
  audio: !(localData.audioTrack?.muted || false),
  video: !(localData.videoTrack?.muted || false),
})

const toggleAudio = () => {
  localData.audioTrack?.setMuted(userMedia.audio)
}

const toggleVideo = () => {
  localData.videoTrack?.setMuted(userMedia.video)
}

const onLeaveClick = async () => {
  roomStore.setRomStatus(RoomStatus.WAITING)
  await client.leave()
}

watch(localData, (val) => {
  userMedia.audio = !(val.audioTrack?.muted || false)
  userMedia.video = !(val.videoTrack?.muted || false)
})

</script>

<style scoped></style>
