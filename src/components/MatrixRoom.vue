<template>
  <div
      id="matrixRoom"
      ref="el"
      class="h-full w-full relative flex py-5 px-5"
      :class="{
        _toolbar: roomStore.isOpenToolbar
      }"
  >

    <div id="matrix-box" class="relative w-full bg-slate-800 rounded">
      <!-- Lưới users -->
      <div class="grid-streams p-4 scrollbar-hide">
        <video-stream v-for="(user, index) in showUsers" :key="index" :user="user" />
      </div>

    </div>

    <div id="toolbar" class="w-0 max-h-full h-full flex-shrink-0">
      <div class="bg-slate-800 rounded h-full ml-5">

        <div
            id="toolbar-content"
            class="h-full"
        >
          <list-user-tab v-if="roomStore.currentTab === 'users'" />
          <chat-tab v-else-if="roomStore.currentTab === 'chat'" />
        </div>

      </div>
    </div>

  </div>


  <div>
    <audio-stream v-for="user in users" :key="user.uid" :user="user" />
  </div>

</template>

<script lang="ts" setup>

import {RoomStatus, useRoomStore} from "../stores/room";
import {useAnime} from "../composables/useAnime";
import {computed, inject, nextTick, onMounted, watch} from "vue"
import VideoStream from "./media/VideoStream.vue";
import ListUserTab from "./controllers/ListUserTab.vue";
import AudioStream from "./media/AudioStream.vue";
import {IUseAgora} from "../composables/useAgora";
import ChatTab from "./controllers/ChatTab.vue";
import {getDatabase, onValue, set} from "firebase/database";
import {ref as dbRef} from "@firebase/database";

const roomStore = useRoomStore()

const anime = useAnime()

watch(() => roomStore.isOpenToolbar, (isOpen) => {
  if(isOpen) {
    anime({
      targets: '#toolbar',
      width: [0, 370],
      easing: 'easeInOutSine',
      duration: 300
    })

  } else {
    anime({
      targets: '#toolbar',
      width: [370, 0],
      easing: 'easeInOutSine',
      duration: 300
    })
  }
}, { immediate: true })

const { users, localData, speakers, usersData, client } = inject<IUseAgora>('ROOM_PROVIDER')!

const localRemove = computed(() => {
  return {
    uid: localData.uid,
    audioTrack: localData.audioTrack,
    videoTrack: localData.videoTrack,
    hasAudio: !localData.audioTrack?.muted,
    hasVideo: !localData.videoTrack?.muted
  }
})
const listUsers = computed(() => {
  return [
    localRemove.value,
    ...users
  ]
})

/**
 * Nếu gắn thủ công => gắn thủ công
 * Đang nói => cuối cùng
 */
const showUsers = computed(() => {

  /// Đang gim ai đó
  if(roomStore.pinner) {
    let user
    if(roomStore.pinner.id === localData.uid) {
      user = localRemove.value
    } else  {
      user = users.filter((user) => user.uid === roomStore.pinner?.id)[0]
    }

    return [user]
  }

  const _talkers = speakers.filter((user) => user.level > 5)

  // ko có ai đang nói
  if(!_talkers.length) {
    return listUsers.value
  }

  // có ai đang nói
  const _index = listUsers.value.findIndex((user) => user.uid === _talkers[0].uid)
  if(_index === -1) {
    return listUsers.value
  }

  return [listUsers.value[_index]]

})

// Lắng ghe => room config
watch( () => usersData, async (users) => {
  const config = roomStore.config

  const db = getDatabase()

  const source: Record<any, any> = {
    count: users.length
  }

  if(users.length === 1) {
    source.lastActive = ''
  }

  await set(dbRef(db, 'room/smileeye'),Object.assign({}, config, source))

}, { deep: true })


onMounted(() => nextTick(() => {

  const db = getDatabase();
  const starCountRef = dbRef(db, 'room/smileeye');
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val()

    roomStore.setConfig({ count: data?.count || 0, chatDisable: data?.chatDisable || false })

    if(/kick-/.test(data.lastActive)) {
      const [key, time, uid] = data.lastActive.split('-')

      const index = usersData.findIndex((user) => user.id.toString() === uid.toString())

      if(index !== -1) {
        usersData.splice(index, 1)
      }

      if(localData.uid?.toString() === uid.toString()) {
        roomStore.setRomStatus(RoomStatus.BANNED)
      }

    }

  })
}))

</script>

<style scoped>
#matrixRoom {
  max-height: calc(100vh - 5rem);
}

.grid-streams {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 15px;
  max-height: 100%;
  overflow-y: auto;
  height: 100%;
}

</style>
