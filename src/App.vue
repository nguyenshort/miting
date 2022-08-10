<template>
  <div class="h-screen bg-white dark:bg-slate-900 max-w-[1100px] mx-auto border-x border-gray-100 text-slate-500">

    <div class="flex items-center h-[60px] border-b border-gray-100">

      <div class="w-[100px] flex justify-center items-center border-r h-full border-gray-100 flex-shrink-0">
        <div class="px-2 py-1 bg-green-500 text-white text-[18px] rounded-md">
          <IonVideocam />
        </div>
      </div>

      <div class="w-full h-full px-4 flex items-center justify-between">
        <h1 class="text-[16px] text-slate-500 font-medium">
          {{ mainStore.chanel }}
        </h1>

        <div class="bg-gray-100 px-2 py-1 rounded-md flex items-center">

          <span class="w-5 h-5 bg-rose-500 rounded-full flex justify-center items-center">

            <span class="w-2 h-2 bg-white"></span>

          </span>

          <span class="text-sm ml-1">
            01:28:24
          </span>

        </div>

      </div>

    </div>
    <suspense>
      <router-view />
    </suspense>
  </div>
</template>

<script lang="ts" setup>
import IonVideocam from '~icons/ion/videocam'
import {useMainStore} from "./stores/main";

const mainStore = useMainStore()
</script>

<style></style>
