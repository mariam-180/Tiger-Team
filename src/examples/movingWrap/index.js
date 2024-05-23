import React from 'react';
import PropTypes from 'prop-types';
import {Box, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';

const MovingText = styled(Box)(({theme}) => ({
  'display': 'flex',
  'whiteSpace': 'nowrap',
  'animation': 'marquee 20s linear infinite',
  '@keyframes marquee': {
    '0%': {
      transform: 'translateX(0)',
    },
    '100%': {
      transform: 'translateX(-100%)',
    },
  },
  '&.paused': {
    animationPlayState: 'paused',
    transition: 'animation-play-state 1.5s ease-in-out',
  },
}));

const CsMovingWrap = ({texts, map, backgroundimage}) => {
  const textPadding = 50 / texts.length;

  return (
    <Box
      sx={{
        'overflow': 'hidden',
        'width': '100vw',
        'height': '17vh',
        'background': `url(${backgroundimage}) no-repeat center center fixed`,
        'backgroundSize': 'cover',
        'display': 'flex',
        'alignItems': 'center',
        'padding': 2,
        '&:hover .moving-text': {
          animationPlayState: 'paused',
        },
      }}
    >
      <MovingText className="moving-text">
        {[...texts, ...texts].map((text, index) => (
          <Typography
            variant="h1"
            color="#ffffff"
            fontSize="clamp(3rem, 2.5vw, 4rem)"
            component="span"
            key={index}
            sx={{paddingRight: `${textPadding}%`, minWidth: 'max-content'}}
          >
            {map ? map(text) : text}
          </Typography>
        ))}
      </MovingText>
    </Box>
  );
};

CsMovingWrap.propTypes = {
  texts: PropTypes.arrayOf(PropTypes.string).isRequired,
  backgroundimage: PropTypes.string,
  map: PropTypes.func,
};

export default CsMovingWrap;
