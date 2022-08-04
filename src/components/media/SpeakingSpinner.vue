<template>
  <div class="w-full h-full rounded-full overflow-hidden bg-blue-600 _volume-badge flex items-center justify-center">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<script>
export default {
  name: "SpeakingSpinner"
}
</script>

<style scoped>
._volume-badge span {
  width: 4px;
  height: 18px;
  background: white;
  border-radius: 3px;
  animation: ns-audio-spin 800ms ease-in-out infinite;
}

._volume-badge span:nth-child(2) {
  margin: 0 2px;
  animation-delay: 400ms;
}

@keyframes ns-audio-spin {
  0% {
    height: 60%;
  }
  50% {
    height: 20%;
  }
  100% {
    height: 60%;
  }
}
</style>
