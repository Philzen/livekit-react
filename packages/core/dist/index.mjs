import { ParticipantEvent, LocalParticipant, Track, ConnectionState, Room, RoomEvent } from 'livekit-client';
import React, { useState, useEffect, useCallback, useRef } from 'react';

function useParticipant(participant) {
  var _useState = useState(false),
      isAudioMuted = _useState[0],
      setAudioMuted = _useState[1];

  var _useState2 = useState(false),
      setVideoMuted = _useState2[1];

  var _useState3 = useState(participant.connectionQuality),
      connectionQuality = _useState3[0],
      setConnectionQuality = _useState3[1];

  var _useState4 = useState(false),
      isSpeaking = _useState4[0],
      setSpeaking = _useState4[1];

  var _useState5 = useState(),
      metadata = _useState5[0],
      setMetadata = _useState5[1];

  var _useState6 = useState([]),
      publications = _useState6[0],
      setPublications = _useState6[1];

  var _useState7 = useState([]),
      subscribedTracks = _useState7[0],
      setSubscribedTracks = _useState7[1];

  var onPublicationsChanged = function onPublicationsChanged() {
    setPublications(Array.from(participant.trackPublications.values()));
    setSubscribedTracks(Array.from(participant.trackPublications.values()).filter(function (pub) {
      return pub.isSubscribed && pub.track !== undefined;
    }));
  };

  useEffect(function () {
    var onMuted = function onMuted(pub) {
      if (pub.kind === Track.Kind.Audio) {
        setAudioMuted(true);
      } else if (pub.kind === Track.Kind.Video) {
        setVideoMuted(true);
      }
    };

    var onUnmuted = function onUnmuted(pub) {
      if (pub.kind === Track.Kind.Audio) {
        setAudioMuted(false);
      } else if (pub.kind === Track.Kind.Video) {
        setVideoMuted(false);
      }
    };

    var onMetadataChanged = function onMetadataChanged() {
      if (participant.metadata) {
        setMetadata(participant.metadata);
      }
    };

    var onIsSpeakingChanged = function onIsSpeakingChanged() {
      setSpeaking(participant.isSpeaking);
    };

    var onConnectionQualityUpdate = function onConnectionQualityUpdate() {
      setConnectionQuality(participant.connectionQuality);
    };

    participant.on(ParticipantEvent.TrackMuted, onMuted).on(ParticipantEvent.TrackUnmuted, onUnmuted).on(ParticipantEvent.ParticipantMetadataChanged, onMetadataChanged).on(ParticipantEvent.IsSpeakingChanged, onIsSpeakingChanged).on(ParticipantEvent.TrackPublished, onPublicationsChanged).on(ParticipantEvent.TrackUnpublished, onPublicationsChanged).on(ParticipantEvent.TrackSubscribed, onPublicationsChanged).on(ParticipantEvent.TrackUnsubscribed, onPublicationsChanged).on(ParticipantEvent.LocalTrackPublished, onPublicationsChanged).on(ParticipantEvent.LocalTrackUnpublished, onPublicationsChanged).on(ParticipantEvent.ConnectionQualityChanged, onConnectionQualityUpdate);
    onMetadataChanged();
    onIsSpeakingChanged();
    onPublicationsChanged();
    return function () {
      participant.off(ParticipantEvent.TrackMuted, onMuted).off(ParticipantEvent.TrackUnmuted, onUnmuted).off(ParticipantEvent.ParticipantMetadataChanged, onMetadataChanged).off(ParticipantEvent.IsSpeakingChanged, onIsSpeakingChanged).off(ParticipantEvent.TrackPublished, onPublicationsChanged).off(ParticipantEvent.TrackUnpublished, onPublicationsChanged).off(ParticipantEvent.TrackSubscribed, onPublicationsChanged).off(ParticipantEvent.TrackUnsubscribed, onPublicationsChanged).off(ParticipantEvent.LocalTrackPublished, onPublicationsChanged).off(ParticipantEvent.LocalTrackUnpublished, onPublicationsChanged).off(ParticipantEvent.ConnectionQualityChanged, onConnectionQualityUpdate);
    };
  }, [participant]);
  var muted;
  participant.audioTrackPublications.forEach(function (pub) {
    muted = pub.isMuted;
  });

  if (muted === undefined) {
    muted = true;
  }

  if (isAudioMuted !== muted) {
    setAudioMuted(muted);
  }

  return {
    isLocal: participant instanceof LocalParticipant,
    isSpeaking: isSpeaking,
    connectionQuality: connectionQuality,
    publications: publications,
    subscribedTracks: subscribedTracks,
    cameraPublication: participant.getTrackPublication(Track.Source.Camera),
    microphonePublication: participant.getTrackPublication(Track.Source.Microphone),
    screenSharePublication: participant.getTrackPublication(Track.Source.ScreenShare),
    metadata: metadata
  };
}

var _iteratorSymbol = /*#__PURE__*/typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
var _asyncIteratorSymbol = /*#__PURE__*/typeof Symbol !== "undefined" ? Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator")) : "@@asyncIterator";
function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

function useRoom(roomOptions) {
  var _useState = useState(),
      room = _useState[0],
      setRoom = _useState[1];

  var _useState2 = useState(false),
      isConnecting = _useState2[0],
      setIsConnecting = _useState2[1];

  var _useState3 = useState(),
      error = _useState3[0],
      setError = _useState3[1];

  var _useState4 = useState([]),
      participants = _useState4[0],
      setParticipants = _useState4[1];

  var _useState5 = useState([]),
      audioTracks = _useState5[0],
      setAudioTracks = _useState5[1];

  var _useState6 = useState(ConnectionState.Disconnected),
      connectionState = _useState6[0],
      setConnectionState = _useState6[1];

  useEffect(function () {
    setRoom(new Room(roomOptions));
  }, []);
  var connectFn = useCallback(function (url, token, options) {
    try {
      setIsConnecting(true);
      return Promise.resolve(_catch(function () {
        var onParticipantsChanged = function onParticipantsChanged() {
          if (!room) return;
          var remotes = Array.from(room.remoteParticipants.values());
          var participants = [room.localParticipant];
          participants.push.apply(participants, remotes);
          setParticipants(participants);
        };

        var onSubscribedTrackChanged = function onSubscribedTrackChanged(track) {
          onParticipantsChanged();

          if (track && track.kind !== Track.Kind.Audio || !room) {
            return;
          }

          var tracks = [];
          room.remoteParticipants.forEach(function (p) {
            p.audioTrackPublications.forEach(function (pub) {
              if (pub.audioTrack) {
                tracks.push(pub.audioTrack);
              }
            });
          });
          setAudioTracks(tracks);
        };

        var onConnectionStateChanged = function onConnectionStateChanged(state) {
          setConnectionState(state);
        };

        if (!room) {
          setError(new Error('room is not ready yet'));
          return;
        }

        room.once(RoomEvent.Disconnected, function () {
          room.off(RoomEvent.ParticipantConnected, onParticipantsChanged).off(RoomEvent.ParticipantDisconnected, onParticipantsChanged).off(RoomEvent.ActiveSpeakersChanged, onParticipantsChanged).off(RoomEvent.TrackSubscribed, onSubscribedTrackChanged).off(RoomEvent.TrackUnsubscribed, onSubscribedTrackChanged).off(RoomEvent.LocalTrackPublished, onParticipantsChanged).off(RoomEvent.LocalTrackUnpublished, onParticipantsChanged).off(RoomEvent.AudioPlaybackStatusChanged, onParticipantsChanged).off(RoomEvent.ConnectionStateChanged, onConnectionStateChanged);
        });
        room.on(RoomEvent.ParticipantConnected, onParticipantsChanged).on(RoomEvent.ParticipantDisconnected, onParticipantsChanged).on(RoomEvent.ActiveSpeakersChanged, onParticipantsChanged).on(RoomEvent.TrackSubscribed, onSubscribedTrackChanged).on(RoomEvent.TrackUnsubscribed, onSubscribedTrackChanged).on(RoomEvent.LocalTrackPublished, onParticipantsChanged).on(RoomEvent.LocalTrackUnpublished, onParticipantsChanged).on(RoomEvent.AudioPlaybackStatusChanged, onParticipantsChanged).on(RoomEvent.ConnectionStateChanged, onConnectionStateChanged);
        return Promise.resolve(room.connect(url, token, options)).then(function () {
          setIsConnecting(false);
          onSubscribedTrackChanged();
          setError(undefined);
          return room;
        });
      }, function (error) {
        setIsConnecting(false);

        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('an error has occured'));
        }

        return undefined;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  }, [room]);
  return {
    connect: connectFn,
    isConnecting: isConnecting,
    room: room,
    error: error,
    participants: participants,
    audioTracks: audioTracks,
    connectionState: connectionState
  };
}

var VideoRenderer = function VideoRenderer(_ref) {
  var _track$mediaStreamTra;

  var track = _ref.track,
      isLocal = _ref.isLocal,
      isMirrored = _ref.isMirrored,
      objectFit = _ref.objectFit,
      className = _ref.className,
      onSizeChanged = _ref.onSizeChanged,
      width = _ref.width,
      height = _ref.height;
  var ref = useRef(null);
  useEffect(function () {
    var el = ref.current;

    if (!el) {
      return;
    }

    el.muted = true;
    track.attach(el);
    return function () {
      track.detach(el);
    };
  }, [track, ref]);
  var handleResize = useCallback(function (ev) {
    if (ev.target instanceof HTMLVideoElement) {
      if (onSizeChanged) {
        onSizeChanged(ev.target.videoWidth, ev.target.videoHeight);
      }
    }
  }, []);
  useEffect(function () {
    var el = ref.current;

    if (el) {
      el.addEventListener('resize', handleResize);
    }

    return function () {
      el === null || el === void 0 ? void 0 : el.removeEventListener('resize', handleResize);
    };
  }, [ref]);
  var style = {
    width: width,
    height: height
  };
  var isFrontFacingOrUnknown = ((_track$mediaStreamTra = track.mediaStreamTrack) === null || _track$mediaStreamTra === void 0 ? void 0 : _track$mediaStreamTra.getSettings().facingMode) !== 'environment';

  if (isMirrored || isMirrored === undefined && isLocal && isFrontFacingOrUnknown) {
    style.transform = 'rotateY(180deg)';
  }

  if (objectFit) {
    style.objectFit = objectFit;
  }

  return React.createElement("video", {
    ref: ref,
    className: className,
    style: style
  });
};

var AudioRenderer = function AudioRenderer(_ref) {
  var track = _ref.track,
      isLocal = _ref.isLocal;
  var audioEl = useRef();
  useEffect(function () {
    if (isLocal) {
      return;
    }

    audioEl.current = track.attach();

    if (track.sid) {
      audioEl.current.setAttribute('data-audio-track-id', track.sid);
    }

    return function () {
      return track.detach().forEach(function (el) {
        return el.remove();
      });
    };
  }, [track, isLocal]);
  return null;
};

export { AudioRenderer, VideoRenderer, useParticipant, useRoom };
//# sourceMappingURL=index.modern.js.map
