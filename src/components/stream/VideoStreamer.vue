<template>
  <div
      ref="elRef"
      class="relative rounded-lg overflow-hidden video-streamer"
      :class="{
          '_talking border-[3px] border-primary-500': isTalking
      }"
  >
    <img v-if="userData?.avatar" class="w-full h-full relative z-10 object-cover" :src="userData?.avatar" alt=""/>
    <div
        ref="video"
        class="videos-stream absolute w-full h-full z-10 top-0 left-0 rounded-lg overflow-hidden"
        :class="{
            'opacity-0': !userMedia.video
        }"
    ></div>

          <div class="absolute z-20 bottom-0 right-0 left-0 px-3 pb-2 flex items-center">
            <button class="w-6 h-6 bg-[#0000006e] flex items-center justify-center rounded-full overflow-hidden text-[14px] text-white">
              <material-symbols-mic-rounded v-if="userMedia?.audio" />
              <material-symbols-mic-off-rounded v-else />
            </button>

            <div class="bg-[#0000006e] text-[13px] text-white px-3 rounded-full px-4 ml-2 line-clamp-1">
              {{ userData?.id === mainStore.currentUser?.id ? 'Bạn' : userData?.name }}
            </div>

          </div>

    <button
        v-if="mainStore.inRoom"
        class="pinner-btn absolute top-2 right-2 z-20 w-6 h-6 bg-[#0000006e] flex items-center justify-center rounded-full overflow-hidden text-[14px] text-white"
        @click="mainStore.togglePinner(uid)"
    >
      <material-symbols-unpin v-if="uid === mainStore.settings.pinner" class="opacity-90" />
      <material-symbols-push-pin v-else class="opacity-90" />
    </button>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>

import {ICameraVideoTrack} from "agora-rtc-sdk-ng"
import MaterialSymbolsMicRounded from '~icons/material-symbols/mic-rounded'
import MaterialSymbolsMicOffRounded from '~icons/material-symbols/mic-off-rounded'
import MaterialSymbolsPushPin from '~icons/material-symbols/push-pin'
import MaterialSymbolsUnpin from '~icons/material-symbols/unpin'


import {computed, nextTick, onMounted, ref, watch} from "vue"
import {useMainStore} from "../../stores/main";
import {useElementVisibility} from "@vueuse/core";

const props = defineProps<{
  source?: ICameraVideoTrack,
  uid: string | number,
  play?: boolean
}>()

const mainStore = useMainStore()

const isTalking = computed(() => {
  return mainStore.talkers.findIndex(t => t.uid === mainStore.currentUser?.id) > -1
})

const userData = computed(() => {
  return mainStore.usersRemote[props.uid]
})

const video = ref<HTMLDivElement>()

onMounted(() => nextTick(() => {
  props.play && props.source?.play(video.value!, { fit: "cover", mirror: false })
}))

watch(() => props.source, (source) => {
  props.play && source?.play(video.value!)
})

const userMedia = computed(() => {

  if(props.uid === mainStore.currentUser?.id) {
    return {
      audio: !mainStore.localTracks.audioTrack?.muted,
      video: !mainStore.localTracks.videoTrack?.muted
    }
  }
  return mainStore.usersMedia[props.uid]
})

const elRef = ref<HTMLDivElement>()
const isVisible = useElementVisibility(elRef)

watch(isVisible, (exist) => {
  if(props.play) {
    if(exist) {
      props.source?.play(video.value!)
    } else {
      props.source?.stop()
    }
  }
})
</script>
