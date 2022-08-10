import {useDevicesList, usePermission} from "@vueuse/core";
import {computed, nextTick, onMounted, ref} from "vue";
import {useMainStore} from "../../stores/main";

export const usePreview = () => {
    const mainStore = useMainStore()
    // Phân quyền
    const micPer = usePermission('microphone')
    const camPre = usePermission('camera')
    const currentCamera = ref<string>()
    const { videoInputs: cameras } = useDevicesList({
        requestPermissions: true,
        onUpdated() {
            if (!cameras.value.find(i => i.deviceId === currentCamera.value))
                currentCamera.value = cameras.value[0]?.deviceId
        },
    })


    const initAgora = async () => {
        mainStore.client = window.AgoraRTC.createClient({
            codec: 'h264',
            mode: 'rtc'
        })

        const [audio, camera] = await window.AgoraRTC.createMicrophoneAndCameraTracks()
        mainStore.localTracks.audioTrack = audio
        mainStore.localTracks.videoTrack = camera
    }

    const userMedia = computed(() => {
        return {
            audio: !mainStore.localTracks.audioTrack?.muted,
            video: !mainStore.localTracks.videoTrack?.muted
        }
    })

    onMounted(() => nextTick(() => initAgora()))


    const toggleAudio = () => {
        mainStore.localTracks.audioTrack?.setMuted(userMedia.value.audio)
    }

    const toggleVideo = () => {
        mainStore.localTracks.videoTrack?.setMuted(userMedia.value.video)
    }

    const canJoin = computed(() => {
        return [micPer.value, camPre.value].some(x => x === 'granted')
    })

    const joinRoom = () => {

    }

    return {
        cameras,
        toggleAudio,
        toggleVideo,
        userMedia,
        canJoin,
        joinRoom,
    }
}
