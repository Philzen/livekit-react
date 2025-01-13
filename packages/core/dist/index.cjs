function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var livekitClient = require('livekit-client');
var React = require('react');
var React__default = _interopDefault(React);

function useParticipant(participant) {
  var _useState = React.useState(false),
      isAudioMuted = _useState[0],
      setAudioMuted = _useState[1];

  var _useState2 = React.useState(false),
      setVideoMuted = _useState2[1];

  var _useState3 = React.useState(participant.connectionQuality),
      connectionQuality = _useState3[0],
      setConnectionQuality = _useState3[1];

  var _useState4 = React.useState(false),
      isSpeaking = _useState4[0],
      setSpeaking = _useState4[1];

  var _useState5 = React.useState(),
      metadata = _useState5[0],
      setMetadata = _useState5[1];

  var _useState6 = React.useState([]),
      publications = _useState6[0],
      setPublications = _useState6[1];

  var _useState7 = React.useState([]),
      subscribedTracks = _useState7[0],
      setSubscribedTracks = _useState7[1];

  var onPublicationsChanged = function onPublicationsChanged() {
    setPublications(Array.from(participant.trackPublications.values()));
    setSubscribedTracks(Array.from(participant.trackPublications.values()).filter(function (pub) {
      return pub.isSubscribed && pub.track !== undefined;
    }));
  };

  React.useEffect(function () {
    var onMuted = function onMuted(pub) {
      if (pub.kind === livekitClient.Track.Kind.Audio) {
        setAudioMuted(true);
      } else if (pub.kind === livekitClient.Track.Kind.Video) {
        setVideoMuted(true);
      }
    };

    var onUnmuted = function onUnmuted(pub) {
      if (pub.kind === livekitClient.Track.Kind.Audio) {
        setAudioMuted(false);
      } else if (pub.kind === livekitClient.Track.Kind.Video) {
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

    participant.on(livekitClient.ParticipantEvent.TrackMuted, onMuted).on(livekitClient.ParticipantEvent.TrackUnmuted, onUnmuted).on(livekitClient.ParticipantEvent.ParticipantMetadataChanged, onMetadataChanged).on(livekitClient.ParticipantEvent.IsSpeakingChanged, onIsSpeakingChanged).on(livekitClient.ParticipantEvent.TrackPublished, onPublicationsChanged).on(livekitClient.ParticipantEvent.TrackUnpublished, onPublicationsChanged).on(livekitClient.ParticipantEvent.TrackSubscribed, onPublicationsChanged).on(livekitClient.ParticipantEvent.TrackUnsubscribed, onPublicationsChanged).on(livekitClient.ParticipantEvent.LocalTrackPublished, onPublicationsChanged).on(livekitClient.ParticipantEvent.LocalTrackUnpublished, onPublicationsChanged).on(livekitClient.ParticipantEvent.ConnectionQualityChanged, onConnectionQualityUpdate);
    onMetadataChanged();
    onIsSpeakingChanged();
    onPublicationsChanged();
    return function () {
      participant.off(livekitClient.ParticipantEvent.TrackMuted, onMuted).off(livekitClient.ParticipantEvent.TrackUnmuted, onUnmuted).off(livekitClient.ParticipantEvent.ParticipantMetadataChanged, onMetadataChanged).off(livekitClient.ParticipantEvent.IsSpeakingChanged, onIsSpeakingChanged).off(livekitClient.ParticipantEvent.TrackPublished, onPublicationsChanged).off(livekitClient.ParticipantEvent.TrackUnpublished, onPublicationsChanged).off(livekitClient.ParticipantEvent.TrackSubscribed, onPublicationsChanged).off(livekitClient.ParticipantEvent.TrackUnsubscribed, onPublicationsChanged).off(livekitClient.ParticipantEvent.LocalTrackPublished, onPublicationsChanged).off(livekitClient.ParticipantEvent.LocalTrackUnpublished, onPublicationsChanged).off(livekitClient.ParticipantEvent.ConnectionQualityChanged, onConnectionQualityUpdate);
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
    isLocal: participant instanceof livekitClient.LocalParticipant,
    isSpeaking: isSpeaking,
    connectionQuality: connectionQuality,
    publications: publications,
    subscribedTracks: subscribedTracks,
    cameraPublication: participant.getTrackPublication(livekitClient.Track.Source.Camera),
    microphonePublication: participant.getTrackPublication(livekitClient.Track.Source.Microphone),
    screenSharePublication: participant.getTrackPublication(livekitClient.Track.Source.ScreenShare),
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
  var _useState = React.useState(),
      room = _useState[0],
      setRoom = _useState[1];

  var _useState2 = React.useState(false),
      isConnecting = _useState2[0],
      setIsConnecting = _useState2[1];

  var _useState3 = React.useState(),
      error = _useState3[0],
      setError = _useState3[1];

  var _useState4 = React.useState([]),
      participants = _useState4[0],
      setParticipants = _useState4[1];

  var _useState5 = React.useState([]),
      audioTracks = _useState5[0],
      setAudioTracks = _useState5[1];

  var _useState6 = React.useState(livekitClient.ConnectionState.Disconnected),
      connectionState = _useState6[0],
      setConnectionState = _useState6[1];

  React.useEffect(function () {
    setRoom(new livekitClient.Room(roomOptions));
  }, []);
  var connectFn = React.useCallback(function (url, token, options) {
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

          if (track && track.kind !== livekitClient.Track.Kind.Audio || !room) {
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

        room.once(livekitClient.RoomEvent.Disconnected, function () {
          room.off(livekitClient.RoomEvent.ParticipantConnected, onParticipantsChanged).off(livekitClient.RoomEvent.ParticipantDisconnected, onParticipantsChanged).off(livekitClient.RoomEvent.ActiveSpeakersChanged, onParticipantsChanged).off(livekitClient.RoomEvent.TrackSubscribed, onSubscribedTrackChanged).off(livekitClient.RoomEvent.TrackUnsubscribed, onSubscribedTrackChanged).off(livekitClient.RoomEvent.LocalTrackPublished, onParticipantsChanged).off(livekitClient.RoomEvent.LocalTrackUnpublished, onParticipantsChanged).off(livekitClient.RoomEvent.AudioPlaybackStatusChanged, onParticipantsChanged).off(livekitClient.RoomEvent.ConnectionStateChanged, onConnectionStateChanged);
        });
        room.on(livekitClient.RoomEvent.ParticipantConnected, onParticipantsChanged).on(livekitClient.RoomEvent.ParticipantDisconnected, onParticipantsChanged).on(livekitClient.RoomEvent.ActiveSpeakersChanged, onParticipantsChanged).on(livekitClient.RoomEvent.TrackSubscribed, onSubscribedTrackChanged).on(livekitClient.RoomEvent.TrackUnsubscribed, onSubscribedTrackChanged).on(livekitClient.RoomEvent.LocalTrackPublished, onParticipantsChanged).on(livekitClient.RoomEvent.LocalTrackUnpublished, onParticipantsChanged).on(livekitClient.RoomEvent.AudioPlaybackStatusChanged, onParticipantsChanged).on(livekitClient.RoomEvent.ConnectionStateChanged, onConnectionStateChanged);
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
  var ref = React.useRef(null);
  React.useEffect(function () {
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
  var handleResize = React.useCallback(function (ev) {
    if (ev.target instanceof HTMLVideoElement) {
      if (onSizeChanged) {
        onSizeChanged(ev.target.videoWidth, ev.target.videoHeight);
      }
    }
  }, []);
  React.useEffect(function () {
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

  return React__default.createElement("video", {
    ref: ref,
    className: className,
    style: style
  });
};

var AudioRenderer = function AudioRenderer(_ref) {
  var track = _ref.track,
      isLocal = _ref.isLocal;
  var audioEl = React.useRef();
  React.useEffect(function () {
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

exports.AudioRenderer = AudioRenderer;
exports.VideoRenderer = VideoRenderer;
exports.useParticipant = useParticipant;
exports.useRoom = useRoom;
//# sourceMappingURL=index.js.map
