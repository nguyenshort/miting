<template>
  <div id="chat-tab" ref="el" class="px-4 h-full flex flex-col">
    <h2 class="text-white font-medium capitalize pt-4 flex justify-between">
      Trò chuyện

      <button class="text-xs font-normal flex items-center" @click="toggleChat">


        <svg v-if="roomStore.config?.chatDisable" xmlns="http://www.w3.org/2000/svg" class="fill-current" width="14px" height="14px" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 320L192 192M192 320l128-128"/></svg>

        <svg v-else xmlns="http://www.w3.org/2000/svg" class="fill-current" width="14px" height="14px" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M352 176L217.6 336 160 272"/></svg>

        <span class="ml-1">Cho phép</span>

      </button>

    </h2>

    <div class="mt-3 h-full relative">
      <div id="chat-list" ref="list" class="w-full bg-slate-900 rounded overflow-y-auto scrollbar-hide py-3">

        <div
            v-for="(value, index) in mess"
            :key="index"
            :data-index="index"
            class="px-3 text-gray-300 text-sm mb-6 last:mb-0"
        >

          <div class="flex items-center">
            <div class="w-[35px] h-[35px] rounded-full bg-slate-800"></div>
            <div class="ml-3">
              <h5 class="mb-0">{{ value.name }}</h5>

              <p class="-mt-0.5 text-[11px]">{{ dayjs(value.createdAt).fromNow() }}</p>

            </div>
          </div>

          <p class="text-xs text-gray-400 mt-2.5">{{ value.content }}</p>

        </div>

      </div>

      <div class="absolute bottom-4 left-0 right-0">

        <div class="relative">
          <input
              v-model="content"
              class="w-full bg-slate-900 rounded text-sm pl-3 py-2.5 text-gray-300 focus:outline-0 transition ease-in-out duration-300 read-only:opacity-50"
              :class="{
                'pr-10': content,
                'pr-3': !content
              }"
              :placeholder="!roomStore.config?.chatDisable ? 'Quản trị viên đã tắt' : 'Nội dung chat...'"
              @keydown.enter="onSubmit"
              :readonly="!roomStore.config?.chatDisable"
          />

          <button
              class="text-gray-300 absolute right-3 top-1/2 transform -translate-y-1/2 transition ease-in-out duration-300"
              :class="{
                'scale-0 opacity-0': !content || !roomStore.config?.chatDisable
              }"
              @click="onSubmit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="fill-current" width="20px" height="20px" viewBox="0 0 512 512"><path d="M53.12 199.94l400-151.39a8 8 0 0110.33 10.33l-151.39 400a8 8 0 01-15-.34l-67.4-166.09a16 16 0 00-10.11-10.11L53.46 215a8 8 0 01-.34-15.06zM460 52L227 285" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
          </button>
        </div>

      </div>

    </div>

  </div>
</template>

<script lang="ts" setup>

import {computed, inject, nextTick, onMounted, ref, watch} from "vue"
import {getDatabase, onValue, ref as dbRef, set} from "firebase/database"
import {v4 as uuidv4} from 'uuid'
import {ISmileeyeUser, IUseAgora} from "../../composables/useAgora"
import {useDayjs} from "../../composables/useDayjs";
import {useCurrentElement, useElementSize} from "@vueuse/core";
import {useRoomStore} from "../../stores/room";

const dayjs = useDayjs()
const roomStore = useRoomStore()

interface IMessage {
  uid: string | number | undefined
  name: any
  avatar: any
  content: string
  createdAt: number
}

const content = ref('')

const messages = ref<{ [p: string]: IMessage }>({})

const mess = computed(() => {
  return Object.values(messages.value).sort((a, b) => a.createdAt - b.createdAt)
})

const { localData, usersData } = inject<IUseAgora>('ROOM_PROVIDER')!

const currentUser = computed<ISmileeyeUser|void>( () => {

  const _index = usersData.findIndex(user => user.id === localData.uid )

  if (_index > -1) {
    return usersData[_index]
  }

})

const onSubmit = async () => {
  if(!content.value.trim() || !currentUser.value) {
    return
  }

  try {

    const db = getDatabase()

    await set(dbRef(db, 'chat/smileeye/' + uuidv4()), <IMessage>{
      uid: localData.uid,
      name: currentUser.value?.name,
      avatar: currentUser.value?.avatar,
      content: content.value,
      createdAt: Date.now()
    })

    content.value = ''

  } catch (e) {
    //
  }

}

const el = ref<HTMLDivElement>()
const { height } = useElementSize(el)

const heightList = computed(() => {
  return (height.value - 125) + 'px'
})

const list = ref<HTMLDivElement>()
onMounted(() => nextTick(() => {

  const db = getDatabase();
  const starCountRef = dbRef(db, 'chat/smileeye');
  onValue(starCountRef, (snapshot) => {
    messages.value = snapshot.val()
    console.log(list.value?.scrollHeight)

    nextTick(() => {
      if(list.value) {
        list.value.scrollTop = list.value.scrollHeight
      }
    })

  });

}))

const toggleChat = async () => {
  const config = roomStore.config

  const db = getDatabase()

  await set(dbRef(db, 'room/smileeye'),Object.assign({}, config, {
    chatDisable: !config?.chatDisable
  }))
}

</script>

<style>
#chat-list {
  height: v-bind(heightList)
}
</style>
