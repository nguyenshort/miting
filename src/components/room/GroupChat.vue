<template>
  <sidebar-item ref="elRef" title="Trò Chuyện">
    <div class="relative">
      <div
          ref="listRef"
          class="overflow-y-auto scrollbar-hide relative z-10"
          :style="{
            height: listHeight
          }"
      >
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

        <div class="h-[70px]"></div>

      </div>

      <form
          class="w-full text-[13px] flex absolute bottom-0 z-20 bg-white pb-3 pt-3"
          @submit.prevent="onSubmitForm"
      >
        <input
            v-model="content"
            type="text"
            class="w-full bg-gray-100 px-3 py-2 rounded-2xl overflow-hidden focus:outline-0"
            placeholder="Nói gì đó..."
        />

        <button
            type="submit"
            class="text-white bg-primary-500 ml-4 aspect-1 flex-shrink-0 rounded-lg overflow-hidden w-8 h-8 flex items-center justify-center text-[16px] transition disabled:opacity-50"
            :disabled="!content || isLoading"
        >
          <ion-paper-plane />
        </button>

      </form>

    </div>
  </sidebar-item>
</template>

<script lang="ts" setup>

import IonPaperPlane from '~icons/ion/paper-plane'
import {computed, nextTick, onMounted, ref} from "vue";
import {useElementSize} from "@vueuse/core";
import {getDatabase, onValue, set} from "firebase/database";
import {ref as dbRef} from "@firebase/database";
import {v4 as uuidv4} from "uuid";
import {useMainStore} from "../../stores/main"
import {useDayjs} from "../../composables/useDayjs";
const mainStore = useMainStore()

const dayjs = useDayjs()

interface IMessage {
  id: string | number
  name: any
  avatar: any
  content: string
  createdAt: number
}
const messages = ref<Record<string, IMessage>>({})

const messagesSorted = computed(() => {
  return Object.values(messages.value).sort((a, b) => {
    return a.createdAt - b.createdAt
  })
})

const elRef = ref<HTMLDivElement>()
const { height } = useElementSize(elRef)

const listHeight = computed(() => (height.value - 50) + 'px')

const content = ref<string>('')

const isLoading = ref<boolean>(false)
const onSubmitForm = async () => {
  isLoading.value = true

  try {
    const db = getDatabase()

    await set(dbRef(db, `room/${mainStore.chanel}/chat/` + uuidv4()),{
      id: mainStore.currentUser?.id,
      name: mainStore.currentUser?.name,
      avatar: mainStore.currentUser?.avatar,
      content: content.value,
      createdAt: Date.now()
    })

    content.value = ''
  } catch (e) {
     //
  }

  isLoading.value = false
}

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
  });

}))

</script>

<style scoped></style>
