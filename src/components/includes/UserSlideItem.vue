<template>
  <div
      class="w-[200px] h-[120px] bg-gray-100 rounded-md flex-shrink-0 mr-5 last:mr-0 overflow-hidden relative"
  >
    <img class="w-full h-full relative z-10" src="/images/img1.jpeg" alt=""/>

    <div class="absolute z-20 bottom-0 right-0 left-0 px-3 pb-2 flex items-center">
      <button class="w-6 h-6 bg-[#0000006e] flex items-center justify-center rounded-full overflow-hidden text-[14px] text-white">
        <material-symbols-mic-rounded />
      </button>

      <div class="bg-[#0000006e] text-[14px] text-white px-3 rounded-full px-4 ml-2">
        Inosuke
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: "UserSlideItem"
}
</script>

<style scoped>

</style>
