<template>
  <sidebar-item ref="elRef" title="Group Chat">
    <div class="relative">
      <div
          class="overflow-y-auto scrollbar-hide relative z-10"
          :style="{
          height: listHeight
        }"
      >
        <div
            v-for="index in 5"
            :key="index"
            class="flex mt-4"
        >

          <div class="w-[40px] h-[40px] bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
            <img class="w-full h-full object-cover" alt="" src="/images/img1.jpeg" />
          </div>

          <div class="w-full ml-3">
            <h4 class="font-medium text-[13px]">Dong Phuong</h4>
            <p class="text-xs mt-1">
              Dịch vụ miễn phí của Google dịch nhanh các từ, cụm từ và trang web giữa tiếng Việt và hơn 100 ngôn ngữ khác.
            </p>

            <div class="text-right">
              <p class="text-[11px] opacity-70">09:24</p>
            </div>
          </div>

        </div>

        <div class="h-[70px]"></div>

      </div>

      <div class="w-full text-[13px] flex absolute bottom-0 z-20 bg-white pb-3 pt-3">
        <input type="text" class="w-full bg-gray-100 px-3 py-2 rounded-2xl overflow-hidden focus:outline-0" placeholder="Make a note" />

        <button class="text-white bg-green-500 ml-4 aspect-1 flex-shrink-0 rounded-lg overflow-hidden w-8 h-8 flex items-center justify-center text-[16px]">
          <ion-paper-plane />
        </button>

      </div>

    </div>
  </sidebar-item>
</template>

<script lang="ts" setup>

import IonPaperPlane from '~icons/ion/paper-plane'
import {computed, ref} from "vue";
import {useElementSize} from "@vueuse/core";

const elRef = ref<HTMLDivElement>()
const { height } = useElementSize(elRef)

const listHeight = computed(() => (height.value - 50) + 'px')

</script>

<style scoped></style>
