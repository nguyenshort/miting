<template>
  <sidebar-item
      id="list-previews"
      :key="mainStore.usersRemote.length"
      title="Người Đang Online"
      class="relative h-full"
      ref="target"
  >
    <div class="relative">
      <ul
          class="overflow-y-auto h-full scrollbar-hide absolute top-0 right-0 bottom-0 left-0"
          :style="{
          height: `${height - 50}px`,
        }"
      >
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

    <span
        v-if="Object.values(mainStore.usersRemote).length"
        class="absolute top-[25px] right-3 transform -translate-y-1/2 text-[11px] px-2 py-0.5 bg-green-500 text-white rounded-lg"
      >
      {{ Object.values(mainStore.usersRemote).length }}
    </span>

  </sidebar-item>
</template>

<script lang="ts" setup>
import {useMainStore} from "../../stores/main";
import {useElementSize} from "@vueuse/core";
import {ref} from "vue";

const mainStore = useMainStore()

const target = ref<HTMLDivElement>()
const { height } = useElementSize(target)
</script>
