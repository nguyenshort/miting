<template>

  <div id="home" class="flex">

    <template v-if="['join', 'preview'].includes(mainStore.roomStatus)">
      <div class="w-8/12 px-5">

        <div class="w-full h-full flex flex-col">

          <user-slide v-if="mainStore.inRoom" ref="slideRef" class="flex-shrink-0" />

          <div v-else class="h-5 flex-shrink-0"></div>

          <main-content
              id="home-body"
              ref="bodyRef"
              class="h-auto flex-shrink-0"
              :style="{ height: heightBody }"
          />

          <navigation-bar ref="bottomRef" />

        </div>

      </div>

      <div class="w-4/12">
        <sidebar-view />
      </div>
    </template>

  </div>

</template>

<script lang="ts" setup>
import {useRoute} from "vue-router"
import {useDevicesList, useElementSize, useWindowSize} from "@vueuse/core";
import {computed, nextTick, onMounted, ref} from "vue";

import {useMainStore} from "../../stores/main";
import {getDatabase, onValue} from "firebase/database";
import {ref as dbRef} from "@firebase/database";
const mainStore = useMainStore()
const route = useRoute()

mainStore.chanel = route.params.id as string

const { height } = useWindowSize()

const slideRef = ref<HTMLDivElement>()
const { height: heighSlide } = useElementSize(slideRef)

const bodyRef = ref<HTMLDivElement>()
const bottomRef = ref<HTMLDivElement>()
const { height: heighBottom } = useElementSize(bottomRef)

const heightContainer = computed(() => {
  return (height.value - 60) + 'px'
})

/**
 * Trừ 70 đầu, slide + bottom
 */
const heightBody = computed(() => {
  if(mainStore.inRoom) {
    return (height.value - heighSlide.value - heighBottom.value - 30 - 70) + 'px'
  } else {
    return (height.value - heighBottom.value - 70 - 20) + 'px'
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
</script>

<style>
#home {
  height: v-bind(heightContainer);
}
</style>
