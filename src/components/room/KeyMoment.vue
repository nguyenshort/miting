<template>
  <sidebar-item title="Ghi Chú">
    <ul class="text-[12px]">
      <li
          v-for="(keyMoment, index) in notesSorted"
          :key="index"
          class="mt-3 last:mb-0"
      >
        <span>
          {{ dayjs(keyMoment.createdAt).fromNow() }}
        </span>

        <span class="ml-5">
          {{ keyMoment.content }}
        </span>
      </li>
    </ul>

    <form
        class="pb-3.5 text-[13px] flex mt-4"
        @submit.prevent="onSubmitForm"
    >
      <input
          v-model="content"
          type="text"
          class="w-full bg-gray-100 px-3 py-2 rounded-2xl overflow-hidden focus:outline-0"
          placeholder="Thêm ghi chú"
      />

      <button
          :disabled="!content || isLoading"
          class="text-white bg-primary-500 ml-4 aspect-1 flex-shrink-0 rounded-lg overflow-hidden w-8 h-8 flex items-center justify-center text-[16px] transition disabled:opacity-50"
      >
        <typcn-pin />
      </button>

    </form>
  </sidebar-item>
</template>

<script lang="ts" setup>
import TypcnPin from '~icons/typcn/pin'
import {computed, nextTick, onMounted, ref} from "vue";
import {getDatabase, onValue, set} from "firebase/database";
import {ref as dbRef} from "@firebase/database";
import {v4 as uuidv4} from "uuid"
import {useMainStore} from "../../stores/main"
import {useDayjs} from "../../composables/useDayjs";

const dayjs = useDayjs()

const mainStore = useMainStore()

const notes = ref<Record<string, INote>>({})

const notesSorted = computed(() => {
  return Object.values(notes.value).sort((a, b) => {
    return a.createdAt - b.createdAt
  }).splice(0, 2)
})

const content = ref<string>('')

const isLoading = ref<boolean>(false)

interface INote {
  id: string | number
  name: any
  avatar: any
  content: string
  createdAt: number
}

const onSubmitForm = async () => {
  isLoading.value = true

  try {
    const db = getDatabase()

    await set(dbRef(db, `room/${mainStore.chanel}/notes/` + uuidv4()),{
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

onMounted(() => nextTick(() => {

  const db = getDatabase();
  const starCountRef = dbRef(db, `room/${mainStore.chanel}/chat`);
  onValue(starCountRef, (snapshot) => {
    notes.value = snapshot.val()
  });

}))
</script>

<style scoped>

</style>
