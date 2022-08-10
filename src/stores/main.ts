import {defineStore} from 'pinia'
import {
    IAgoraRTCClient,
    IAgoraRTCRemoteUser,
    ICameraVideoTrack,
    IMicrophoneAudioTrack
} from "agora-rtc-sdk-ng";

export interface ISmileeyeUser {
    id: string|number
    name: string
    avatar: string
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
        usersRemote: {}
    }),
    // optional getters
    getters: {
        // Có user đang ghim
        auth: (state) => !!state.currentUser,
        inRoom: (state) => state.roomStatus === 'join'
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
        }
    }
})
