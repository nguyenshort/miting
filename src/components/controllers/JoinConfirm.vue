<template>


  <div class="h-screen w-full flex items-center justify-center bg-slate-800">
    <div class="overflow-hidden px-5 flex items-center">

      <div class="overflow-hidden bg-slate-900 rounded relative">

        <div ref="stream" class="object-cover w-[450px] h-[270px] z-10 relative" />

        <div class="z-20 absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-center">

        </div>

      </div>

      <div class="w-[350px] flex justify-center items-center flex-col">

        <div class="flex">
          <button class="bg-blue-600 px-4 py-2 rounded-full text-xs text-white font-medium disabled:opacity-60" :disabled="isCancel" @click="onJoin">Tham Gia </button>

          <div class="w-5"></div>

          <button class="bg-rose-600 px-4 py-2 rounded-full text-xs text-white font-medium" type="danger" @click="isCancel = true">Huỷ Bỏ</button>
        </div>

        <div class="mt-4 text-white text-xs">
          <span class="text-xs">Phòng: {{ chanel }} | {{ roomStore.config?.count || 0 }} người tham gia</span>
        </div>

        <div v-if="isCancel" class="mt-4 text-white text-xs">
          Bạn đã lựa chọn không tham gia cuộc họp.
        </div>

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
import {inject, nextTick, onMounted, ref} from 'vue'
import { useDevicesList } from '@vueuse/core'
import {RoomStatus, useRoomStore} from "../../stores/room";
import {IUseAgora} from "../../composables/useAgora";
const currentCamera = ref<string>()
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find(i => i.deviceId === currentCamera.value))
      currentCamera.value = cameras.value[0]?.deviceId
  },
})

const { initUserMedia, localData, join, unpublishListener, publishedListener, leftListener, volumesListener } = inject<IUseAgora>('ROOM_PROVIDER')!

const roomStore = useRoomStore()

const isCancel = ref(false)

const chanel = ref('smileeye')

const stream = ref<HTMLDivElement>()
onMounted(() => nextTick(async () => {
  await initUserMedia()
  localData.videoTrack?.play(stream.value)
}))

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

</script>

<style scoped>

</style>
