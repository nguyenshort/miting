import {inject, reactive, UnwrapNestedRefs} from "vue";
import {AGORA_CONSTANT} from "../../plugins/rtc";
import agora, {IAgoraRTCClient, IAgoraRTCRemoteUser, ILocalTrack, UID} from "agora-rtc-sdk-ng"

export interface IRomSpeaker {
    uid: UID
    level: number
}

export interface ISmileeyeUser {
    id: string|number
    name: string
    avatar: string
}

export interface IUseAgora {
    client: IAgoraRTCClient;
    users: Array<IAgoraRTCRemoteUser>;
    usersData: Array<ISmileeyeUser>;
    speakers: Array<IRomSpeaker>;
    localData: UnwrapNestedRefs<{ uid: string | number | undefined; audioTrack: ILocalTrack | undefined; videoTrack: ILocalTrack | undefined }>;
    join: (chanel: string, userID: (string | number)) => Promise<void>;
    publishedListener: () => void;
    unpublishListener: () => void;
    leftListener: () => void
    volumesListener: () => void;
    initUserMedia: () => Promise<void>;
}

export const useAgora = () => {

    const client = inject<IAgoraRTCClient>(AGORA_CONSTANT)!

    const localData = reactive<{
        uid: string|number|undefined
        audioTrack: ILocalTrack|undefined
        videoTrack: ILocalTrack|undefined
    }>({
        uid: undefined,
        audioTrack: undefined,
        videoTrack: undefined
    })

    const users = reactive<IAgoraRTCRemoteUser[]>([])
    const usersData = reactive<ISmileeyeUser[]>([])

    const speakers = reactive<IRomSpeaker[]>([])

    const join = async (chanel: string, userID: string | number) => {
        await client.join("6bc0bf7f3e364153ba533fd765fb9c60", chanel, null, userID)

        localData.uid = userID
        await initUserMedia()

        const _traks = []

        if(localData.audioTrack) {
            _traks.push(localData.audioTrack)
        }
        if(localData.videoTrack) {
            _traks.push(localData.videoTrack)
        }

        if(_traks.length > 0) {
            await client.publish(_traks as ILocalTrack[])
        }

        upsertUser(userID)
    }

    const initUserMedia = async () => {

        if(!localData.audioTrack) {
            localData.audioTrack = await agora.createMicrophoneAudioTrack()
        }
        if(!localData.videoTrack) {
            localData.videoTrack = await agora.createCameraVideoTrack()
        }
    }

    const publishedHandle = async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
        await client.subscribe(user, mediaType)

        upsertUser(user.uid)

        const _index = users.findIndex(u => u.uid === user.uid)
        if (_index === -1) {

            users.push(user)

        } else {

            const _user = Object.assign({}, users[_index])

            if (mediaType === "audio") {
                _user.audioTrack = user.audioTrack
                _user.hasAudio = user.hasAudio
            } else {
                _user.videoTrack = user.videoTrack
                _user.hasVideo = user.hasVideo
            }

            users[_index] = _user

        }
    }

    const publishedListener = () => {
        client.on("user-published", publishedHandle)
    }

    const unpublishListener = () => {
        client.on("user-unpublished", publishedListener)
    }

    const leftListener = () => {
        client.on('user-left',(user: IAgoraRTCRemoteUser) => {
            const _index = users.findIndex(item => item.uid === user.uid)
            if (_index > -1) {
                users.splice(_index, 1)
                usersData.splice(_index, 1)
            }
        })
    }

    const upsertUser = (uid: string | number) => {
        const exist = users.findIndex(u => u.uid === uid)
        if (exist === -1) {
            usersData.push({
                id: uid,
                name: 'user-' + uid,
                avatar: ''
            })
        }
    }

    const upsertSpeaker =(speaker: IRomSpeaker) => {
        const _index = speakers.findIndex(s => s.uid === speaker.uid)
        if (_index === -1) {
            speakers.push(speaker)
        } else {
            speakers[_index] = speaker
        }
    }

    const volumesListener = () => {
        client.enableAudioVolumeIndicator()
        client.on("volume-indicator", (volumes) => {

            volumes.forEach((volume) => {
                upsertSpeaker(volume)
            })

        })
    }

    return <IUseAgora>{
        client,
        users,
        usersData,
        localData,
        speakers,
        join,
        publishedListener,
        unpublishListener,
        leftListener,
        volumesListener,
        initUserMedia
    }

}
