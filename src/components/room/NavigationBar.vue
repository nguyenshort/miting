<template>
  <div class="h-[70px] flex-shrink-0">

    <div class="h-full relative flex justify-center items-center">
      <button
          class="bg-gray-100 px-2.5 py-1.5 rounded-lg flex items-center text-slate-500 absolute top-1/2 left-0 transform -translate-y-1/2"
      >
        <heroicons-solid-volume-up class="text-[14px]" />

        <div class="ml-2 h-1.5 w-[70px] bg-gray-200 rounded-full">
          <div class="w-[45px] h-1.5 rounded-full bg-green-500"></div>
        </div>

      </button>

      <button
          class="px-3 py-1.5 text-[13px] font-medium uppercase rounded-lg flex items-center text-white absolute top-1/2 right-0 transform -translate-y-1/2"
          :class="{
              'bg-rose-500': mainStore.inRoom,
              'bg-primary-500': !mainStore.inRoom,
          }"
          @click="clickToggle"
      >
        <tabler-record-mail class="text-[20px]" />
        <span class="ml-1">{{ mainStore.inRoom ? 'Leave' : 'Join' }}</span>
      </button>


      <div id="navigation-actions" class="flex items-center">

        <navigation-button
            :active="!userMedia.audio"
            @click="toggleAudio"
        >
          <material-symbols-mic-rounded v-if="userMedia.audio" />
          <material-symbols-mic-off-rounded v-else />
        </navigation-button>

        <navigation-button
            :active="!userMedia.video"
            @click="toggleVideo"
        >
          <ph-video-camera-fill v-if="userMedia.video" />
          <ph-video-camera-slash-fill v-else />
        </navigation-button>

        <button
            v-if="mainStore.inRoom"
            class="w-[32px] h-[32px] bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg"
        >
          <ic-round-screen-share />
        </button>

        <button
            v-if="mainStore.inRoom"
            class="w-[32px] h-[32px] bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg"
        >
          <mdi-credit-card-multiple />
        </button>

        <navigation-button>
          <tabler-share />
        </navigation-button>

      </div>

    </div>

  </div>
</template>

<script lang="ts" setup>
import TablerRecordMail from '~icons/tabler/record-mail'
import MaterialSymbolsMicRounded from '~icons/material-symbols/mic-rounded'
import HeroiconsSolidVolumeUp from '~icons/heroicons-solid/volume-up'
import MaterialSymbolsMicOffRounded from '~icons/material-symbols/mic-off-rounded'
import PhVideoCameraFill from '~icons/ph/video-camera-fill'
import PhVideoCameraSlashFill from '~icons/ph/video-camera-slash-fill'
import IcRoundScreenShare from '~icons/ic/round-screen-share'
import TablerShare from '~icons/tabler/share'
import MdiCreditCardMultiple from '~icons/mdi/credit-card-multiple'
import {useMainStore} from "../../stores/main";
import {computed, ref, toRaw} from "vue";
import {usePermission} from "@vueuse/core";
import {IAgoraRTCRemoteUser, ILocalTrack} from "agora-rtc-sdk-ng";
import {getDatabase, onValue, set} from "firebase/database";
import {ref as dbRef} from "@firebase/database";
import {RoomStatus} from "../../stores/room";
import {v4 as uuidv4} from "uuid";

// Phân quyền
const micPer = usePermission('microphone')
const camPre = usePermission('camera')

const mainStore = useMainStore()

const userMedia = computed(() => {
  return {
    audio: !mainStore.localTracks.audioTrack?.muted,
    video: !mainStore.localTracks.videoTrack?.muted
  }
})

const toggleAudio = () => {
  console.log('toggleAudio')
  mainStore.localTracks.audioTrack?.setMuted(userMedia.value.audio)
}

const toggleVideo = () => {
  mainStore.localTracks.videoTrack?.setMuted(userMedia.value.video)
}

const canJoin = computed(() => {
  return [micPer.value, camPre.value].some(x => x === 'granted')
})

const isLoading = ref(false)

const enableEventListener = () => {
  if(!mainStore.client) {
    return
  }
  mainStore.client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
    await toRaw(mainStore.client)!.subscribe(user, mediaType)
    await mainStore.upsertUser(user, mediaType)
  })
}

const joinRoom = async () => {
  isLoading.value = true
  try {

    enableEventListener()

    setTimeout(async () => {
      await toRaw(mainStore.client)?.join(import.meta.env.VITE_AGORA_API_KEY, mainStore.chanel, null, mainStore.currentUser!.id as number)

      const tracks = Object.values(mainStore.localTracks).filter(x => x).map(y => toRaw(y))
      await toRaw(mainStore.client)?.publish(tracks as unknown as ILocalTrack[])

      const db = getDatabase();
      await set(dbRef(db, `room/${mainStore.chanel}/users/${mainStore.currentUser?.id}`), mainStore.currentUser)

      mainStore.roomStatus = 'join'
      isLoading.value = false
    }, 1000)

  } catch (e) {
    // Todo: error handling
    isLoading.value = false
  }
}

const clickToggle = async () => {
  if(mainStore.inRoom) {
    // await mainStore.client?.leave()
    // mainStore.roomStatus = 'leave'
  } else {
    await joinRoom()
  }
}

</script>

<style scoped>
#navigation-actions > button + button {
  margin-left: 15px;
}
</style>