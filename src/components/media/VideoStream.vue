<template>
  <div
      :id="'video-stream-' + user.uid"
      ref="el"
      class="relative stream relative rounded overflow-hidden bg-slate-900"
      :class="{
        _exist: isVisible
      }"
  >
    <div
        class="absolute right-4 top-4 z-30 transition duration-300 ease-in-out w-[30px] h-[30px]"
        :class="{
          'opacity-0': volume?.level <= 5 || !volume
        }"
    >
      <speaking-spinner />
    </div>

    <div
        class="z-20 absolute w-full h-full transition transform duration-300 ease-in-out border-4"
        :class="{
          'border-blue-700': volume?.level > 5,
          'border-transparent': volume?.level <= 5 || !volume,
        }"
    ></div>

    <div class="absolute w-full h-full z-10 flex items-center justify-center">
      <auto-avatar name="N"/>
    </div>
<!--    <img class="w-1/2 h-auto rounded-full rounded-fullabsolute" src="https://picsum.photos/200" alt="" />-->
    <div
        ref="video"
        class="videos-stream absolute w-full h-full z-10"
        :class="{
          'opacity-0': !hasVideo,
        }"
    ></div>
  </div>
<!--  <div v-for="index in 30" :key="index" class="bg-slate-900 rounded overflow-hidden aspect-1 flex items-center justify-center">-->
<!--    <img class="w-1/2 h-auto rounded-full" src="https://picsum.photos/200" alt="" />-->
<!--  </div>-->
</template>

<script lang="ts" setup>

import {IAgoraRTCRemoteUser, IRemoteVideoTrack} from "agora-rtc-sdk-ng";
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import {useElementVisibility} from "@vueuse/core"
import {IRomSpeaker, IUseAgora} from "../../composables/useAgora";
import SpeakingSpinner from "./SpeakingSpinner.vue";
import AutoAvatar from "../AutoAvatar.vue";

const { speakers } = inject<IUseAgora>('ROOM_PROVIDER')!

const props = defineProps<{
  user: IAgoraRTCRemoteUser,
}>()

const hasVideo = ref(false)

const video = ref<HTMLDivElement>()
const el = ref<HTMLDivElement>()

watch(() => props.user, ({ videoTrack, audioTrack }) => {
  nextTick(() => {
    videoTrack?.play(video.value!)
  })
})
watch(() => props.user.videoTrack, (audioTrack) => {
  const trask = audioTrack as (IRemoteVideoTrack & Record<any, any>)
  hasVideo.value = !trask.muted && trask.enabled
}, { deep: true })

onMounted(() => nextTick(() => {
  props.user.videoTrack?.play(video.value!)
}))

const isVisible = useElementVisibility(el)

watch(isVisible, (exist) => {
  if(exist) {
    props.user.videoTrack?.play(video.value!)
  } else {
    props.user.videoTrack?.stop()
  }
})

const volume = computed<IRomSpeaker|boolean>(() => {
  const _index =  speakers?.findIndex(({ uid }) => uid === props.user.uid)
  return speakers[_index]
})

</script>
