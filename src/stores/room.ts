import {defineStore} from 'pinia'

export enum RoomStatus {
    WAITING,
    JOINED,
    BANNED
}

interface ISmileeyeUser {
    id: string|number
    name: string
    avatar: string
}

interface IRoomConfig {
    count?: number
    chatDisable?: boolean
}

type State = {
    currentTab: string
    roomStatus: RoomStatus
    pinner?: ISmileeyeUser
    config?: IRoomConfig
}

export const useRoomStore = defineStore('room', {
    // a function that returns a fresh state
    state: (): State => ({
        currentTab: '',
        roomStatus: RoomStatus.WAITING,
        pinner: undefined,
        config: {}
    }),
    // optional getters
    getters: {
        // Có user đang ghim
        hasPinner: (state) => state.pinner !== undefined,
        isOpenToolbar: (state: State) => ['users', 'info', 'chat'].includes(state.currentTab),
    },
    // optional actions
    actions: {
        setCurrentTab(tab: string) {
            this.currentTab = tab === this.currentTab ? '' : tab
        },
        setRomStatus(status: RoomStatus) {
            this.roomStatus = status
        },
        setPinner(user?: ISmileeyeUser) {
            this.pinner = user?.id === this.pinner?.id ? undefined : user
        },
        setConfig(config: IRoomConfig) {
            this.config = config
        }
    },
})
