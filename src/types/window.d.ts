import {App} from "vue";
import {IAgoraRTC} from "agora-rtc-sdk-ng";

declare global {
    interface Window {
        _VUE: App<Element>
        AgoraRTC: IAgoraRTC
    }
}

