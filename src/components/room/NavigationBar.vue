<template>

  <div class="flex w-full">
    <div class="w-full">
      <div class="h-[70px] flex-shrink-0 px-5 overflow-x-hidden">

        <div class="h-full relative flex md:justify-center items-center">

          <button
              class="hidden md:flex bg-gray-100 px-2.5 py-1.5 rounded-lg items-center text-slate-500 absolute top-1/2 left-0 transform -translate-y-1/2"
          >
            <heroicons-solid-volume-up class="text-[14px]" />

            <div class="ml-2 h-1.5 w-[70px] bg-gray-200 rounded-full">
              <div class="w-[45px] h-1.5 rounded-full bg-green-500"></div>
            </div>

          </button>


          <div id="navigation-actions" class="flex items-center md:justify-center w-full">

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
                class="w-[32px] h-[32px] bg-gray-100 items-center justify-center text-gray-500 rounded-lg hidden md:flex"
            >
              <ic-round-screen-share />
            </button>

            <navigation-button>
              <tabler-share />
            </navigation-button>

            <button
                class="px-3 py-1.5 text-[13px] font-medium uppercase rounded-lg flex items-center text-white md:absolute md:top-1/2 md:right-0 md:transform md:-translate-y-1/2 md:transition disabled:opacity-50"
                :class="{
                'bg-rose-500': mainStore.inRoom,
                'bg-primary-500': !mainStore.inRoom,
              }"
                :disabled="isLoading"
                @click="clickToggle"
            >
              <tabler-record-mail class="text-[20px]" />
              <span class="ml-1 hidden md:block">{{ mainStore.inRoom ? 'Leave' : 'Join' }}</span>
            </button>

            <navigation-button
                class="md:hidden !ml-auto"
                :class="{
                  'open': openedShortcuts
                }"
                @click="openedShortcuts = !openedShortcuts"
                :active="openedShortcuts"
            >
              <foundation-info />
            </navigation-button>

          </div>

        </div>

      </div>
    </div>

    <div id="navi-tools-actions" class="hidden md:flex w-[300px] flex-shrink-0 items-center justify-end px-5">
      <navigation-button
          @click="mainStore.currentTab = 'users'"
          :active="mainStore.currentTab === 'users'"
          :disabled="!mainStore.inRoom"
      >
        <fa6-solid-users-viewfinder />
      </navigation-button>
      <navigation-button
          @click="mainStore.currentTab = 'chat'"
          :active="mainStore.currentTab === 'chat'"
          :disabled="!mainStore.inRoom"
      >
        <ph-messenger-logo-fill />
      </navigation-button>
      <navigation-button>
        <foundation-info />
      </navigation-button>
    </div>

  </div>
</template>

<script lang="ts" setup>
import FoundationInfo from '~icons/foundation/info'
import PhMessengerLogoFill from '~icons/ph/messenger-logo-fill'
import Fa6SolidUsersViewfinder from '~icons/fa6-solid/users-viewfinder'
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
import {computed, nextTick, onMounted, ref, toRaw} from "vue";
import {usePermission} from "@vueuse/core";
import {IAgoraRTCRemoteUser, ILocalTrack} from "agora-rtc-sdk-ng";
import {getDatabase, onValue, set} from "firebase/database";
import {ref as dbRef, remove} from "@firebase/database"

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

  mainStore.client.setLowStreamParameter({
    width: 160,
    height: 120,
    framerate: 15,
    bitrate: 120,
  });

  // mainStore.client.enableDualStream()

  mainStore.client.enableAudioVolumeIndicator()

  mainStore.client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
    await toRaw(mainStore.client)!.subscribe(user, mediaType)
    await mainStore.upsertUser(user, mediaType)
  })

  mainStore.client.on("user-unpublished", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
    console.log('user-unpublished', user, mediaType)
    await mainStore.upsertUser(user, mediaType)
  })

  mainStore.client.on("volume-indicator", (volumes: any) => {
    volumes.forEach((volume: any) => {
      mainStore.upsertVolume(volume)
    })
  })

  mainStore.client.on('user-left',(user: IAgoraRTCRemoteUser) => {
    mainStore.users = mainStore.users.filter(x => x.uid !== user.uid)
  })

}

const onLeave = async () => {
  const db = getDatabase();
  await Promise.all([
    remove(dbRef(db, `room/${mainStore.chanel}/media/${mainStore.currentUser?.id}`)),
    remove(dbRef(db, `room/${mainStore.chanel}/users/${mainStore.currentUser?.id}`))
  ])
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
    await mainStore.client?.leave()
    mainStore.roomStatus = 'leave'
    await onLeave()
  } else {
    await joinRoom()
  }
}

onMounted(() => nextTick(() => {
  window.addEventListener('beforeunload', async () => {
    if(mainStore.inRoom) {
      await onLeave()
    }
  })
}))

const openedShortcuts = ref(false)

</script>

<style scoped>
#navigation-actions > button + button {
  margin-left: 15px;
}

#navi-tools-actions > button + button {
  margin-left: 15px;
}

#navi-tools-actions > button:hover {
  background: #3b66f5;
}

#navi-tools-actions > button._action {
  @apply bg-primary-600 hover:shadow-primary-300
}

#navi-tools-actions > button._action:hover {
  @apply bg-primary-600 hover:shadow-primary-300
}
</style>
