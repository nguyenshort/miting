<template>
  <div v-if="roomStore.roomStatus === RoomStatus.JOINED" class="h-screen bg-slate-900 flex flex-col">

    <matrix-room />
    <bottom-bar />
  </div>

  <join-confirm v-else-if="roomStore.roomStatus === RoomStatus.WAITING" />

  <kick-out v-else-if="roomStore.roomStatus === RoomStatus.BANNED" ></kick-out>

</template>

<script lang="ts" setup>
import BottomBar from "./components/controllers/BottomBar.vue"
import MatrixRoom from "./components/MatrixRoom.vue"
import {useAgora} from "./composables/useAgora";
import {nextTick, onMounted, provide} from "vue"
import {useRoomStore, RoomStatus} from "./stores/room";
import JoinConfirm from "./components/controllers/JoinConfirm.vue";
import {getDatabase, onValue} from "firebase/database";
import {ref as dbRef} from "@firebase/database";
import KickOut from "./components/controllers/KickOut.vue";

const roomStore = useRoomStore()

const agora = useAgora()

provide('ROOM_PROVIDER', agora)


onMounted(() => nextTick(() => {

  const db = getDatabase();
  const starCountRef = dbRef(db, 'room/smileeye');
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val()

    roomStore.setConfig({ count: data?.count || 0, chatDisable: data?.chatDisable || false })

  });

}))

</script>

<style></style>
