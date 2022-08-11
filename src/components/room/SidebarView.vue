<template>
  <div ref="el" class="pr-5 pt-5 h-full flex flex-col">

    <template v-if="mainStore.inRoom">
      <component id="chat" class="flex-shrink-0" :is="currentTab"></component>
    </template>
    <users-preview v-else />

  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import {useElementSize, useWindowSize} from "@vueuse/core"
import {useMainStore} from "../../stores/main"

import GroupChat from "../../components/room/GroupChat.vue"
import UsersPreview from "../../components/room/UsersPreview.vue"
import RoomSetting from "../../components/room/RoomSetting.vue"

const mainStore = useMainStore()

const currentTab = computed(() => {
  if(mainStore.currentTab === 'chat') {
    return GroupChat
  } else if (mainStore.currentTab === 'users') {
    return UsersPreview
  } else {
    return RoomSetting
  }
})

const { height } = useWindowSize()

const heightChat = computed(() => {
  return `calc(${height.value - 70 - 70}px - 1.25rem)`
})
</script>

<style scoped>
#chat {
  height: v-bind(heightChat);
}
</style>
