import React, {useState, useEffect, useRef} from 'react';
import {gsap} from 'gsap';

import racingVideo from 'assets/videos/racing.mp4';
import driftingVideo from 'assets/videos/drifting.mp4';
import formulaVideo from 'assets/videos/formula.mp4';
import rallyVideo from 'assets/videos/rally.mp4';

import racingImage from 'assets/images/backGround/racing.jpeg';
import driftingImage from 'assets/images/backGround/drifting.jpeg';
import formulaImage from 'assets/images/backGround/formula.png';
import rallyImage from 'assets/images/backGround/rally.jpeg';

import ResponsiveVideo from 'components/ThisVideo';
import RotatingRing from 'examples/sliders';

import {Box, Paper, IconButton} from '@mui/material';
import FlipToBackIcon from '@mui/icons-material/FlipToBack';
import FlipToFrontIcon from '@mui/icons-material/FlipToFront';

const videos = [
  {title: 'GT racing', url: racingVideo, thumbnail: racingImage},
  {title: 'Drifting', url: driftingVideo, thumbnail: driftingImage},
  {title: 'Formula', url: formulaVideo, thumbnail: formulaImage},
  {title: 'Rally', url: rallyVideo, thumbnail: rallyImage},
  {title: 'GT racing', url: racingVideo, thumbnail: racingImage},
  {title: 'Drifting', url: driftingVideo, thumbnail: driftingImage},
  {title: 'Formula', url: formulaVideo, thumbnail: formulaImage},
  {title: 'Rally', url: rallyVideo, thumbnail: rallyImage},
];

const VideoSlider = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [showRing, setShowRing] = useState(true);
  const [transitionPhase, setTransitionPhase] = useState('idle');
  const ringRef = useRef();

  const updateVideo = (index) => {
    setCurrentVideo(index);
    setTransitionPhase('fadein');
    gsap.to(ringRef.current, {
      y: 100,
      opacity: 0,
      display: 'none',
      duration: 0.5,
    });
  };

  const handleRingSelect = (index) => {
    updateVideo(index);
    setShowRing(!showRing);
  };

  const toggleRingVisibility = () => {
    const newY = showRing ? 100 : 0;
    const newOpacity = showRing ? 0 : 1;
    gsap.to(ringRef.current, {
      y: newY,
      opacity: newOpacity,
      display: newOpacity ? 'block' : 'none',
      duration: 0.5,
    });
    setShowRing(!showRing);
  };

  useEffect(() => {
    if (transitionPhase === 'fadein') {
      setTimeout(() => setTransitionPhase('idle'), 500);
    }
  }, [transitionPhase]);

  return (
    <Box
      position="relative"
      width="100%"
      overflow="hidden"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
      }}
    >
      <IconButton
        sx={{
          position: 'absolute',
          top: 30,
          right: '1%',
          zIndex: 3,
          color: 'gray',
        }}
        onClick={toggleRingVisibility}
      >
        {showRing ? <FlipToBackIcon /> : <FlipToFrontIcon />}
      </IconButton>

      <Box
        sx={{position: 'absolute', top: 0, width: '100%', zIndex: 2}}
        ref={ringRef}
      >
        <RotatingRing
          images={videos.map((video, index) => ({
            id: `${video.title}-${index}`,
            url: video.thumbnail,
          }))}
          onSelect={handleRingSelect}
        />
      </Box>

      <Paper
        elevation={3}
        sx={{
          width: '100%',
          background: '#000',
          overflow: 'hidden',
          transition: 'filter 0.5s ease',
          filter: showRing ?
            'blur(6px) brightness(20%)' :
            'blur(0px) brightness(100%)',
        }}
      >
        <ResponsiveVideo
          iscontrolled={true}
          ismuted={false}
          isslider={true}
          videoSrc={videos[currentVideo].url}
        />
      </Paper>
    </Box>
  );
};
export default VideoSlider;
