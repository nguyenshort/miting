<template>
  <sidebar-item title="Key Moments">
    <ul class="text-[12px] h-[100px]">
      <li
          v-for="index in 3"
          :key="index"
          class="mt-3 last:mb-0"
      >
        <span>00:02:24</span>

        <span class="ml-5">Meet Phuong Teacher</span>
      </li>
    </ul>

    <div class="pb-3.5 text-[13px] flex">
      <input type="text" class="w-full bg-gray-100 px-3 py-2 rounded-2xl overflow-hidden focus:outline-0" placeholder="Make a note" />

      <button class="text-white bg-green-500 ml-4 aspect-1 flex-shrink-0 rounded-lg overflow-hidden w-8 h-8 flex items-center justify-center text-[16px]">
        <typcn-pin />
      </button>

    </div>
  </sidebar-item>
</template>

<script lang="ts" setup>
import TypcnPin from '~icons/typcn/pin'
</script>

<style scoped>

</style>
