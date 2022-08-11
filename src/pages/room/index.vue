<template>

  <div id="home">

    <div class="overflow-hidden relative flex">
      <div
          id="dynamicList"
          class="w-full px-5 relative z-10"
      >

        <div class="w-full h-full flex flex-col">

          <user-slide v-if="showSlide" ref="slideRef" class="flex-shrink-0" />

          <div v-else class="h-5 flex-shrink-0"></div>

          <main-content
              id="home-body"
              ref="bodyRef"
              class="h-auto flex-shrink-0 transition"
              :style="{ height: heightBody }"
          />

        </div>

      </div>
      <div
          ref="sideBarRef"
          class="w-[300px] flex-shrink-0"
      >
        <sidebar-view />
      </div>
    </div>

    <navigation-bar ref="bottomRef" />

  </div>

</template>

<script lang="ts" setup>
import {useRoute} from "vue-router"
import {useDevicesList, useElementSize, useWindowSize} from "@vueuse/core";
import {computed, nextTick, onMounted, ref, watch} from "vue";

import {useMainStore} from "../../stores/main";
import {getDatabase, onValue, set} from "firebase/database";
import {ref as dbRef} from "@firebase/database";
import {v4 as uuidv4} from "uuid";
const mainStore = useMainStore()
const route = useRoute()

mainStore.chanel = route.params.id as string

const { height } = useWindowSize()

const slideRef = ref<HTMLDivElement>()
const { height: heighSlide } = useElementSize(slideRef)

const bodyRef = ref<HTMLDivElement>()
const bottomRef = ref<HTMLDivElement>()
const { height: heighBottom } = useElementSize(bottomRef)

const showSlide = computed(() => {
  return mainStore.inRoom && mainStore.settings.smallGrid
})

const heightContainer = computed(() => {
  return (height.value - 60) + 'px'
})

/**
 * Trừ 70 đầu, slide + bottom
 */
const heightBody = computed(() => {
  if(showSlide.value) {
    return (height.value - heighSlide.value - heighBottom.value - 30 - 70) + 'px'
  } else {
    return (height.value - heighBottom.value - 70 - 10) + 'px'
  }
})


const currentCamera = ref<string>()
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find(i => i.deviceId === currentCamera.value))
      currentCamera.value = cameras.value[0]?.deviceId
  },
})

onMounted(() => nextTick(() => {

  const db = getDatabase();
  const usersRef = dbRef(db, `room/${mainStore.chanel}/users`)
  onValue(usersRef, (snapshot) => {
    const data = snapshot.val()

    mainStore.setUsersRemote(JSON.parse(JSON.stringify(data)))

  })
}))

onMounted(() => nextTick(() => {
  setTimeout(() => {
    mainStore.currentTab = 'users'
  }, 500)
}))

watch(() => [!mainStore.localTracks.audioTrack?.muted, !mainStore.localTracks.videoTrack?.muted], async ([audio, video]) => {
  const db = getDatabase();
  const usersRef = dbRef(db, `room/${mainStore.chanel}/media/${mainStore.currentUser?.id}`)

  await set(usersRef,{
    uid: mainStore.currentUser?.id,
    audio,
    video
  })

})

onMounted(() => nextTick(() => {

  const db = getDatabase();
  const usersRef = dbRef(db, `room/${mainStore.chanel}/media`)
  onValue(usersRef, (snapshot) => {
    const data = snapshot.val()

    mainStore.usersMedia = JSON.parse(JSON.stringify(data))

  })
}))
</script>

<style>
#home {
  height: v-bind(heightContainer);
}
#dynamicList {
  width: calc(100% - 300px);
}
</style>
