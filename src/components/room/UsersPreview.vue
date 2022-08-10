<template>
  <sidebar-item
      id="list-previews"
      :key="mainStore.usersRemote.length"
      title="Người Đang Online"
      class="relative"
  >
    <ul>
      <li
          v-for="user in Object.values(mainStore.usersRemote).splice(0, 5)"
          :key="user.id"
          class="mt-5"
      >
        <div class="flex items-center">
          <img :src="user.avatar" class="w-9 h-9 rounded-full"  alt=""/>
          <span class="text-[13px] ml-3">{{ user.name }}</span>
        </div>
      </li>
    </ul>

    <span
        v-if="Object.values(mainStore.usersRemote).length"
        class="absolute top-[25px] right-3 transform -translate-y-1/2 text-[11px] px-2 py-0.5 bg-green-500 text-white rounded-lg"
    >{{ Object.values(mainStore.usersRemote).length }}</span>

  </sidebar-item>
</template>

<script lang="ts" setup>
import {useMainStore} from "../../stores/main";

const mainStore = useMainStore()
</script>

<style scoped>
#list-previews {
  height: calc(100% - 24px);
}
</style>
