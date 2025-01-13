/// <reference types="react" />
import { Property } from 'csstype';
import { Track } from 'livekit-client';
export interface VideoRendererProps {
    track: Track;
    isLocal: boolean;
    /**
     * Mirror the video on the y axis.
     * Is `true` by default for local, front-facing (and undetermined facing) media tracks,
     * unless overriden by this setting */
    isMirrored?: boolean;
    objectFit?: Property.ObjectFit;
    className?: string;
    width?: Property.Width;
    height?: Property.Height;
    onSizeChanged?: (width: number, height: number) => void;
}
export declare const VideoRenderer: ({ track, isLocal, isMirrored, objectFit, className, onSizeChanged, width, height, }: VideoRendererProps) => JSX.Element;
