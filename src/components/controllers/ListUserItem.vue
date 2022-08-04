<template>
  <div class="flex items-center">
    <div class="w-[35px] h-[35px] rounded-full bg-slate-900"></div>

    <h4 class="text-white ml-3 text-sm">{{ user.name || 'Smileeye Users' }}</h4>

    <div class="w-5 mx-auto flex-shrink-0"></div>


    <div
        class="w-[20px] h-[20px] transition duration-300 ease-in-out"
        :class="{
          'opacity-0': volume?.level <= 5 || !volume
        }"
    >
      <speaking-spinner />
    </div>

    <button class="text-white ml-2.5" v-if="usersData.length > 1" @click="roomStore.setPinner(user)">
      <svg v-if="user.id === roomStore.pinner?.id" xmlns="http://www.w3.org/2000/svg" class="fill-current" width="16px" height="16px" viewBox="0 0 512 512"><path d="M315.27 33L96 304h128l-31.51 173.23a2.36 2.36 0 002.33 2.77h0a2.36 2.36 0 001.89-.95L416 208H288l31.66-173.25a2.45 2.45 0 00-2.44-2.75h0a2.42 2.42 0 00-1.95 1z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="fill-current" width="16px" height="16px" viewBox="0 0 512 512"><path d="M432 448a15.92 15.92 0 01-11.31-4.69l-352-352a16 16 0 0122.62-22.62l352 352A16 16 0 01432 448zM294.34 84.28l-22.08 120.84a16 16 0 006.17 15.71 16.49 16.49 0 009.93 3.17h94.12l-38.37 47.42a4 4 0 00.28 5.34l17.07 17.07a4 4 0 005.94-.31l60.8-75.16a16.37 16.37 0 003.3-14.36 16 16 0 00-15.5-12H307.19L335.4 37.63c.05-.3.1-.59.13-.89A18.45 18.45 0 00302.73 23l-92.58 114.46a4 4 0 00.28 5.35l17.07 17.06a4 4 0 005.94-.31zM217.78 427.57l22-120.71a16 16 0 00-6.19-15.7 16.54 16.54 0 00-9.92-3.16h-94.1l38.36-47.42a4 4 0 00-.28-5.34l-17.07-17.07a4 4 0 00-5.93.31L83.8 293.64A16.37 16.37 0 0080.5 308 16 16 0 0096 320h108.83l-28.09 154.36v.11a18.37 18.37 0 0032.5 14.53l92.61-114.46a4 4 0 00-.28-5.35l-17.07-17.06a4 4 0 00-5.94.31z"/></svg>
    </button>


    <button
        class="text-white ml-2.5 transition hover:text-rose-600"
        @click="kickUser"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="fill-current" width="16px" height="16px" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>    </button>

  </div>
</template>

<script lang="ts" setup>
import SpeakingSpinner from "../media/SpeakingSpinner.vue"
import {useRoomStore} from "../../stores/room"
import {computed, inject} from "vue"
import {IRomSpeaker, ISmileeyeUser, IUseAgora} from "../../composables/useAgora"
import {getDatabase, set} from "firebase/database";
import {ref as dbRef} from "@firebase/database";

const props = defineProps<{
  user: ISmileeyeUser
}>()

const roomStore = useRoomStore()
const { usersData, speakers } = inject<IUseAgora>('ROOM_PROVIDER')!

const volume = computed<IRomSpeaker|boolean>(() => {
  const _index =  speakers?.findIndex(({ uid }) => uid === props.user.id)
  return speakers[_index]
})

const kickUser = async () => {
  const config = roomStore.config

  const db = getDatabase()

  await set(dbRef(db, 'room/smileeye'),Object.assign({}, config, {
    lastActive: 'kick-' + Date.now() + '-' + props.user.id
  }))
}

</script>
