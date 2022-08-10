<template>
  <div ref="el" class="pr-5 pt-5 h-full flex flex-col">

    <template v-if="mainStore.inRoom">
      <key-moment ref="momentRef" class="flex-shrink-0" />
      <div class="h-[24px] flex-shrink-0"></div>
      <group-chat id="chat" class="flex-shrink-0"></group-chat>
    </template>
    <users-preview v-else :key="mainStore.counterChange" />

  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import {useElementSize} from "@vueuse/core"
import {useMainStore} from "../../stores/main";

const mainStore = useMainStore()

const el = ref<HTMLDivElement>()
const {height} = useElementSize(el)

const momentRef = ref<HTMLDivElement>()
const { height: heightMoment } = useElementSize(momentRef)

const heightChat = computed(() => {
  return (height.value - heightMoment.value - 24 - 20) + 'px'
})
</script>

<style scoped>
#chat {
  height: v-bind(heightChat);
}
</style>
