import {defineStore} from 'pinia'
import {
    IAgoraRTCClient,
    IAgoraRTCRemoteUser,
    ICameraVideoTrack,
    IMicrophoneAudioTrack, UID
} from "agora-rtc-sdk-ng";

export interface ISmileeyeUser {
    id: string|number
    name: string
    avatar: string
}

export interface IAgoraVolume {
    level: number
    uid: UID
}

type IRoomSettings = {
    playMode: 'auto' | 'manual' | 'grids'
    pinner: UID
    minLevel: number
    smallGrid: boolean
}

type State = {
    currentUser?: ISmileeyeUser
    roomStatus: 'preview' | 'join' | 'leave' | 'kick',
    client?: IAgoraRTCClient
    localTracks: {
        audioTrack: IMicrophoneAudioTrack|undefined
        videoTrack: ICameraVideoTrack|undefined
    }
    users: Array<IAgoraRTCRemoteUser>
    usersRemote: Record<string|number, ISmileeyeUser>
    chanel: string
    volumes: Array<IAgoraVolume>
    currentTab: 'chat' | 'settings' | 'users' | ''
    settings: IRoomSettings,
    usersMedia: Record<string|number, {id: UID, audio: boolean, video: boolean}>
    mobileTab: {
        chat: boolean
        settings: boolean
        users: boolean
        formChat: boolean
    }
}

export const useMainStore = defineStore('main', {
    // a function that returns a fresh state
    state: (): State => ({
        currentUser: {
            id: Math.round(Math.random() * 1000000),
            name: 'Nguyen Dang Quang',
            avatar: 'https://avatars3.githubusercontent.com/u/1020?s=460&v=4'
        },
        roomStatus: 'preview',
        chanel: '',
        localTracks: {
            audioTrack: undefined,
            videoTrack: undefined
        },
        client: undefined,
        users: [],
        usersRemote: {},
        volumes: [],
        currentTab: '',
        settings: {
            playMode: 'grids',
            pinner: '',
            minLevel: 5,
            smallGrid: true
        },
        usersMedia: {},
        mobileTab: {
            chat: false,
            settings: false,
            users: false,
            formChat: false
        }
    }),
    // optional getters
    getters: {
        // Có user đang ghim
        auth: (state) => !!state.currentUser,
        inRoom: (state) => state.roomStatus === 'join',
        focused: (state) => {
            let uid: UID|undefined
            if(state.settings.pinner) {
                uid = state.settings.pinner
            } else {
                uid = state.volumes.filter(v => v.level > state.settings.minLevel)?.[0]?.uid || state.currentUser?.id
            }
            if(state.users.findIndex(u => u.uid === uid) > -1) {
                return uid
            }
            return state.currentUser?.id
        },
        talkers: (state): IAgoraVolume[] => state.volumes.filter(v => v.level > state.settings.minLevel)
    },
    // optional actions
    actions: {
        async upsertUser(user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") {
            const _index = this.users.findIndex(u => u.uid === user.uid)
            if (_index === -1) {
                this.users.push(user)
            } else {
                const _user = Object.assign({}, this.users[_index])

                if (mediaType === "audio") {
                    _user.audioTrack = user.audioTrack
                    _user.hasAudio = user.hasAudio
                } else {
                    _user.videoTrack = user.videoTrack
                    _user.hasVideo = user.hasVideo
                }

                this.users[_index] = _user
            }
        },

        setUsersRemote(users: Record<string|number, ISmileeyeUser>) {
            this.usersRemote = users
        },

        upsertVolume(volume: IAgoraVolume) {
            const _index = this.volumes.findIndex(v => v.uid === volume.uid)
            if (_index === -1) {
                this.volumes.push(volume)
            } else {
                const _volume = Object.assign({}, this.volumes[_index])
                _volume.level = volume.level
                this.volumes[_index] = _volume
            }
        },

        togglePinner(uid: UID) {
            this.settings.pinner = this.settings.pinner === uid ? '' : uid
        },

        setMobileTab(tab: any) {
            this.mobileTab = tab
        }
    }
})
