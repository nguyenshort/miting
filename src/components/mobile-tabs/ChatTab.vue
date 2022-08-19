<template>
  <div class="px-3">
    <h4 class="mt-4 pb-2">Trò Chuyện</h4>
    <div ref="listRef" id="chat-list-mb" class="overflow-y-auto scrollbar-hide">
      <div
          v-for="(mess, index) in messagesSorted"
          :key="index"
          class="flex mt-4"
      >

        <div class="w-[40px] h-[40px] bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
          <img class="w-full h-full object-cover" alt="" :src="mess.avatar" />
        </div>

        <div class="w-full ml-3">
          <h4 class="font-medium text-[13px]">
            {{ mess.name }}
          </h4>
          <p class="text-xs mt-1">
            {{ mess.content }}
          </p>

          <div class="text-right">
            <p class="text-[11px] opacity-70">
              {{ dayjs(mess.createdAt).fromNow() }}
            </p>
          </div>
        </div>

      </div>
    </div>
    <div class="relative mt-5">
      <van-button round type="success" size="small" block @click="mainStore.mobileTab.formChat = true">
        Add Message
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useDayjs} from "../../composables/useDayjs";
import {computed, nextTick, onMounted, ref} from "vue";
import {getDatabase, onValue} from "firebase/database";
import {ref as dbRef} from "@firebase/database";
import {useMainStore} from "../../stores/main";

const dayjs = useDayjs()
const mainStore = useMainStore()

interface IMessage {
  id: string | number
  name: any
  avatar: any
  content: string
  createdAt: number
}
const messages = ref<Record<string, IMessage>>({})

const messagesSorted = computed(() => {
  return Object.values(messages.value || {}).sort((a, b) => {
    return a.createdAt - b.createdAt
  })
})

const listRef = ref<HTMLDivElement>()
onMounted(() => nextTick(() => {

  const db = getDatabase();
  const starCountRef = dbRef(db, `room/${mainStore.chanel}/chat`);
  onValue(starCountRef, (snapshot) => {
    messages.value = snapshot.val()
    nextTick(() => {
      if(listRef.value) {
        listRef.value.scrollTop = listRef.value.scrollHeight
      }
    })
  })
}))

</script>

<style>
#chat-list-mb {
  height: calc(90vh - 120px);
}
</style>

