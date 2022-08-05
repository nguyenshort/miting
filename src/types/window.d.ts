import {App} from "vue";
import type {IAgoraRTC} from "agora-rtc-sdk-ng";

declare global {
    interface Window {
        _VUE: App<Element>
        AgoraRTC: IAgoraRTC
    }
}

