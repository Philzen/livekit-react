import { AudioTrack, Participant, Room, RoomOptions, RoomConnectOptions, ConnectionState } from 'livekit-client';
export interface RoomState {
    connect: (url: string, token: string, options?: RoomConnectOptions) => Promise<Room | undefined>;
    isConnecting: boolean;
    room?: Room;
    participants: Participant[];
    audioTracks: AudioTrack[];
    error?: Error;
    connectionState: ConnectionState;
}
export declare function useRoom(roomOptions?: RoomOptions): RoomState;
