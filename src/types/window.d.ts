import {App} from "vue";

declare global {
    interface Window {
        _VUE: App<Element>
    }
}

