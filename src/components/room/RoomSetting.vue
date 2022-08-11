<template>
  <sidebar-item
      id="list-previews"
      title="Cài Đặt Phòng"
      class="relative h-full"
  >

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

  </sidebar-item>
</template>

<script lang="ts" setup>
import {useMainStore} from "../../stores/main";

const mainStore = useMainStore()

const changeSmallGrid = () => {
  mainStore.settings.smallGrid = !mainStore.settings.smallGrid
}
</script>

<style scoped>
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
