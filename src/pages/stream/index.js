import React, { useRef, useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import io from 'socket.io-client';

const useStyles = makeStyles({
  streamPageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  authenticationContainer: {
    marginBottom: '20px',
    transition: 'margin-bottom 0.3s ease',
  },
  passwordInput: {
    padding: '10px',
    fontSize: '16px',
    transition:
      'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
    '&:focus': {
      outline: 'none',
      borderColor: '#007bff',
      backgroundColor: '#f0f0f0',
    },
  },
  authenticateButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  streamButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#218838',
    },
    zIndex: 1,
  },
  videoContainer: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
  },
  videoElement: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '5px',
  },
});

const StreamPage = () => {
  const classes = useStyles();
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const videoRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    const socketURL = process.env.REACT_APP_SOCKET_ENDPOINT;
    socket.current = io(socketURL);

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const authenticate = () => {
    if (password === process.env.REACT_APP_STREAM_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const toggleStream = async () => {
    if (!authenticated) {
      alert('Please authenticate first');
      return;
    }

    if (!streaming) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const peerConnection = new RTCPeerConnection();
        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.current.emit('candidate', event.candidate);
          }
        };

        peerConnection.onnegotiationneeded = async () => {
          try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.current.emit('offer', offer);
          } catch (error) {
            console.error('Error creating offer:', error);
          }
        };

        peerConnection.ontrack = (event) => {
          if (videoRef.current) {
            videoRef.current.srcObject = event.streams[0];
          }
        };

        setStreaming(true);
      } catch (error) {
        console.error('Error accessing camera or microphone:', error);
        alert(
          'Failed to access camera or microphone. ' +
            'Please check your permissions.',
        );
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        setStreaming(false);
      }
    }
  };

  return (
    <div className={classes.streamPageContainer}>
      {!authenticated && (
        <div className={classes.authenticationContainer}>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
            className={classes.passwordInput}
          />
          <button onClick={authenticate} className={classes.authenticateButton}>
            Authenticate
          </button>
        </div>
      )}
      {authenticated && (
        <div className={classes.streamControlsContainer}>
          <button onClick={toggleStream} className={classes.streamButton}>
            {streaming ? 'Stop Streaming' : 'Start Streaming'}
          </button>
          <div className={classes.videoContainer}>
            <video
              ref={videoRef}
              autoPlay={true}
              playsInline={true}
              muted={true}
              className={classes.videoElement}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamPage;
