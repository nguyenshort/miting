<template>

  <div class="h-screen w-full flex items-center justify-center bg-slate-800">
    <div class="overflow-hidden px-5 flex items-center">

      <div class="overflow-hidden bg-slate-900 rounded relative">

        <div
            ref="stream"
            class="object-cover w-[450px] h-[270px] z-10 relative"
            :class="{
                'opacity-0 invisible': !userMedia.video,
            }"
        />

        <div
            v-if="!userMedia.video"
            class="absolute w-full h-full bg-slate-900 flex items-center justify-center top-0 left-0"
        >
          <p class="text-white text-xs">Bạn đã tắt Camera</p>
        </div>

        <div class="z-20 absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-center">

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

        </div>

      </div>

      <div class="w-[350px] flex justify-center items-center flex-col">

        <div class="flex">
          <button
              class="bg-blue-600 px-4 py-2 rounded-full text-xs text-white font-medium disabled:opacity-60"
              :disabled="isCancel || [microphonePermission, cameraPermission].every(x => x === 'denied')"
              @click="onJoin"
          >
            Tham Gia
          </button>

          <div class="w-5"></div>

          <button class="bg-rose-600 px-4 py-2 rounded-full text-xs text-white font-medium" type="danger" @click="isCancel = true">Huỷ Bỏ</button>
        </div>

        <div class="mt-4 text-white text-xs">
          <span class="text-xs">Phòng: {{ chanel }} | {{ roomStore.config?.count || 0 }} người tham gia</span>
        </div>

        <div v-if="isCancel" class="mt-4 text-white text-xs">
          Bạn đã lựa chọn không tham gia cuộc họp.
        </div>

        <div v-if="[cameraPermission, microphonePermission].includes('denied')" class="mt-4 text-white text-xs">
          Bạn đã từ chối quyền truy cập:
          <span v-if="microphonePermission === 'denied'">Micro</span>
          <span class="ml-2" v-if="cameraPermission === 'denied'">Camera</span>
        </div>

        <p
            v-if="[microphonePermission, cameraPermission].every(x => x === 'denied')"
            class="mt-4 text-white text-xs"
        >Bạn cần cho phép Camera hoặc Micro để bắt đầu</p>

        <div v-else class="mt-4">
          <div
              v-for="camera of cameras"
              :key="camera.deviceId"
              class="px-2 py-1 cursor-pointer text-white text-xs"
              :class="{'text-primary': currentCamera === camera.deviceId }"
              @click="currentCamera = camera.deviceId"
          >
            {{ camera.label }}
          </div>
        </div>

      </div>

    </div>

  </div>

</template>

<script lang="ts" setup>
import {computed, inject, ref, watch} from 'vue'
import {useDevicesList, usePermission} from '@vueuse/core'
import {RoomStatus, useRoomStore} from "../../stores/room"
import {IUseAgora} from "../../composables/useAgora"

const microphonePermission = usePermission('microphone')
const cameraPermission = usePermission('camera')
const currentCamera = ref<string>()
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find(i => i.deviceId === currentCamera.value))
      currentCamera.value = cameras.value[0]?.deviceId
  },
})

const { initUserMedia, localData, join, unpublishListener, publishedListener, leftListener, volumesListener, client } = inject<IUseAgora>('ROOM_PROVIDER')!

const roomStore = useRoomStore()

const isCancel = ref(false)

const chanel = ref('smileeye')

const stream = ref<HTMLDivElement>()

watch([microphonePermission, cameraPermission], async ([audio, video], [prevAudio, prevVideo]) => {


  if(audio === 'granted') {
    await initUserMedia().audio()
  }
  if(video === 'granted') {
    await initUserMedia().video()
    localData.videoTrack?.play(stream.value)
  }

})

const onJoin = async () => {
  publishedListener()
  unpublishListener()
  leftListener()
  volumesListener()

  setTimeout(async () => {
    await join('smileeye', Math.round(Math.random() * 1000000 ))

    roomStore.setRomStatus(RoomStatus.JOINED)

  }, 1000)
}

const userMedia = computed(() => {
  return {
    audio: !(localData.audioTrack?.muted || false),
    video: !(localData.videoTrack?.muted || false),
  }
})

const toggleAudio = () => {
  localData.audioTrack?.setMuted(userMedia.value.audio)
}

const toggleVideo = () => {
  localData.videoTrack?.setMuted(userMedia.value.video)
}

</script>

<style scoped>

</style>
