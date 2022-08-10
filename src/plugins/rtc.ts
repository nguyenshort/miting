import type { App } from 'vue'
import {reactive} from "vue";
import {IAgoraRTCClient} from "agora-rtc-sdk-ng";

export const AGORA_CONSTANT = Symbol.for('agora')

const plugin = {
    install(app: App) {
        app.provide(AGORA_CONSTANT, reactive<IAgoraRTCClient|{}>({}))
    }
}

export default plugin
