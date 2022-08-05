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
      <auto-avatar
          name="N"
          :class="{
              _talking: volume?.level > 5
          }"
      />
    </div>
    <div
        ref="video"
        class="videos-stream absolute w-full h-full z-10"
        :class="{
          'opacity-0': !hasVideo,
        }"
    ></div>
  </div>
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

const hasVideo = computed(() => {
  return props.user.hasVideo
})

const video = ref<HTMLDivElement>()
const el = ref<HTMLDivElement>()

watch(() => props.user, ({ videoTrack }) => {
  nextTick(() => {
    videoTrack?.play(video.value!)
  })
})

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
