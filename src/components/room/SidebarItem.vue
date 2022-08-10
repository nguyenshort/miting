<template>
  <div class="w-full rounded-xl border border-gray-100 overflow-hidden flex flex-col">
    <div class="px-5 h-[50px] flex items-center bg-gray-100 text-[15px] flex-shrink-0">
      {{ title }}
    </div>
    <div
        class="px-5"
    >

      <slot></slot>

    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<style scoped>

</style>
