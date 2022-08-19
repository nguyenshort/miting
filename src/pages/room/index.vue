<template>

  <div id="home">

    <div class="overflow-hidden relative flex">
      <div
          id="dynamicList"
          class="w-full px-5 relative z-10"
      >

        <div class="w-full h-full flex flex-col">

          <user-slide v-if="showSlide" ref="slideRef" class="flex-shrink-0" />

          <div v-else class="h-5 flex-shrink-0"></div>

          <main-content
              id="home-body"
              ref="bodyRef"
              class="h-auto flex-shrink-0 transition"
              :style="{ height: heightBody }"
          />

        </div>

      </div>
      <div
          ref="sideBarRef"
          class="hidden md:block w-[300px] flex-shrink-0"
      >
        <sidebar-view />
      </div>
    </div>

    <navigation-bar ref="bottomRef" />

    <van-popup
        v-model:show="mainStore.mobileTab.chat"
        closeable
        round
        position="bottom"
        :style="{ height: '90%' }"
        teleport="body"
    >
      <chat-tab />
    </van-popup>

    <van-popup
        v-model:show="mainStore.mobileTab.formChat"
        closeable
        round
        position="bottom"
        teleport="body"
    >
      <div class="px-3">
        <h4 class="mt-4 pb-2">Thêm Tin Nhắn Mới</h4>
        <van-field
            v-model="content"
            class="chat-form-input-mb"
            type="textarea"
            placeholder="Nhập tin nhắn"
            rows="6"
            :autosize="true"
        />

        <div class="my-4">
          <van-button round type="primary" size="small" block :loading="isLoading" @click="onSubmitForm">
            Add Message
          </van-button>
        </div>
      </div>
    </van-popup>

    <van-popup
        v-model:show="mainStore.mobileTab.users"
        closeable
        round
        position="bottom"
        teleport="body"
        :style="{ maxHeight: '90%', height: 'auto' }"
    >
      <div class="px-3">
        <h4 class="mt-4 pb-2">Danh Sách Thành Viên</h4>

        <ul class="overflow-y-auto h-full pb-5">
          <li
              v-for="user in mainStore.usersRemote"
              :key="user.id"
              class="mt-5"
          >
            <div class="flex items-center">
              <img :src="user.avatar" class="w-9 h-9 rounded-full"  alt=""/>
              <span class="text-[13px] ml-3">{{ user.name }}</span>
            </div>
          </li>
        </ul>

      </div>
    </van-popup>

    <van-popup
        v-model:show="mainStore.mobileTab.settings"
        closeable
        round
        position="bottom"
        teleport="body"
        :style="{ maxHeight: '90%', height: 'auto' }"
    >
      <div class="px-3 pb-5">
        <h4 class="mt-4 pb-2">Cài Đặt</h4>

        <div class="mt-3">
          <div>
            <h4 class="text-[15px]">Bố Cục:</h4>

            <div class="mt-1.5 flex items-center">
              <label class="text-[13px] flex items-center cursor-pointer">
                <input type="radio" v-model="mainStore.settings.playMode" value="manual" />
                <span class="ml-1">Thủ Công</span>
              </label>
              <label class="text-[13px] flex items-center ml-4 cursor-pointer">
                <input type="radio" v-model="mainStore.settings.playMode" value="auto" />
                <span class="ml-1">Tự động</span>
              </label>
              <label class="text-[13px] flex items-center ml-4 cursor-pointer">
                <input type="radio" v-model="mainStore.settings.playMode" value="grids" />
                <span class="ml-1">Lưới</span>
              </label>
            </div>

          </div>

          <div class="bg-gray-200 w-full h-px my-5"></div>

          <div>
            <h4 class="text-[15px]">Lưới Thu Nhỏ:</h4>

            <div class="mt-1.5">
              <div class="flex items-center">
                <input
                    class="transition block appearance-none w-9 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm relative block"
                    type="checkbox"
                    role="switch"
                    :checked="mainStore.settings.smallGrid"
                    id="flexSwitchCheckDefault"
                    @change="changeSmallGrid"
                >
                <label class="form-check-label inline-block text-gray-500 text-[13px] ml-3" for="flexSwitchCheckDefault">
                  Kích hoạt
                </label>
              </div>

            </div>

          </div>

          <div class="bg-gray-200 w-full h-px my-5"></div>

          <div>
            <h4 class="text-[15px]">Kích Thước</h4>

            <div class="mt-1.5">

              <div class="text-[13px]">Độ Nhạy</div>

              <div class="mt-2 relative">
                <input
                    v-model.number="mainStore.settings.minLevel"
                    type="range"
                    class="appearance-none w-full h-6 p-0 block focus:outline-none bg-transparent focus:ring-0 focus:shadow-none rounded-lg overflow-hidden absolute z-20"
                    min="1"
                    max="20"
                />

                <div id="input-range" class="relative w-full h-2 bg-gray-100 rounded-lg" style="transform: translateY(8px)">
                  <div
                      class="h-full rounded-lg bg-primary-600"
                      :style="{
                    width: `${(mainStore.settings.minLevel / 20) * 100}%`,
                  }"
                  ></div>
                </div>

              </div>

              <p class="text-xs opacity-70 mt-5">Độ nhạy của focus tự động. Màn hình sẽ tự động chọn người nói ở bố cục tự động</p>

            </div>

          </div>

        </div>

      </div>
    </van-popup>

  </div>

</template>

<script lang="ts" setup>
import {useRoute} from "vue-router"
import {useDevicesList, useElementSize, useWindowSize} from "@vueuse/core";
import {computed, nextTick, onMounted, ref, watch} from "vue";

import {useMainStore} from "../../stores/main";
import {getDatabase, onValue, set} from "firebase/database";
import {ref as dbRef} from "@firebase/database";
import {v4 as uuidv4} from "uuid";
const mainStore = useMainStore()
const route = useRoute()

mainStore.chanel = route.params.id as string

const { height } = useWindowSize()

const slideRef = ref<HTMLDivElement>()
const { height: heighSlide } = useElementSize(slideRef)

const bodyRef = ref<HTMLDivElement>()
const bottomRef = ref<HTMLDivElement>()
const { height: heighBottom } = useElementSize(bottomRef)

const showSlide = computed(() => {
  return mainStore.inRoom && mainStore.settings.smallGrid
})

const heightContainer = computed(() => {
  return (height.value - 60) + 'px'
})

/**
 * Trừ 70 đầu, slide + bottom
 */
const heightBody = computed(() => {
  if(showSlide.value) {
    return (height.value - heighSlide.value - heighBottom.value - 30 - 70) + 'px'
  } else {
    return (height.value - heighBottom.value - 70 - 10) + 'px'
  }
})


const currentCamera = ref<string>()
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find(i => i.deviceId === currentCamera.value))
      currentCamera.value = cameras.value[0]?.deviceId
  },
})

onMounted(() => nextTick(() => {

  const db = getDatabase();
  const usersRef = dbRef(db, `room/${mainStore.chanel}/users`)
  onValue(usersRef, (snapshot) => {
    if(snapshot.exists()) {
      const data = snapshot.val()

      mainStore.setUsersRemote(JSON.parse(JSON.stringify(data)))
    }

  })
}))

onMounted(() => nextTick(() => {
  setTimeout(() => {
    mainStore.currentTab = 'users'
  }, 500)
}))

watch(() => [!mainStore.localTracks.audioTrack?.muted, !mainStore.localTracks.videoTrack?.muted], async ([audio, video]) => {
  const db = getDatabase();
  const usersRef = dbRef(db, `room/${mainStore.chanel}/media/${mainStore.currentUser?.id}`)

  await set(usersRef,{
    uid: mainStore.currentUser?.id,
    audio,
    video
  })

})

onMounted(() => nextTick(() => {

  const db = getDatabase();
  const usersRef = dbRef(db, `room/${mainStore.chanel}/media`)
  onValue(usersRef, (snapshot) => {

    if(snapshot.exists()) {
      const data = snapshot.val()
      mainStore.usersMedia = JSON.parse(JSON.stringify(data))
    }

  })
}))

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
  mainStore.mobileTab.formChat = false
  isLoading.value = false
}

const changeSmallGrid = () => {
  mainStore.settings.smallGrid = !mainStore.settings.smallGrid
}

</script>

<style>
#home {
  height: v-bind(heightContainer);
}
.chat-form-input-mb {
  background: #f6f6f6;
  border-radius: 10px;
}

#flexSwitchCheckDefault {
  @apply  checked:bg-primary-600 before:w-4 before:h-4 before:rounded-full before:left-0 before:transition before:bg-white before:absolute before:top-1/2
}

#flexSwitchCheckDefault:before {
  transform: translate(2px, -50%);
}

#flexSwitchCheckDefault:checked:before {
  transform: translate(18px, -50%)
}
</style>
