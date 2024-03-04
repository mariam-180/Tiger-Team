import React from 'react';

import {styled, useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {ControlRotate} from 'components/ThisInteractive/ControlRotate';
import {ControlTranslate} from 'components/ThisInteractive/ControlTranslate';
import {ScrollableArea} from 'components/ThisInteractive/ScrollableArea';
import AnimatedTypingText from 'utils/Typing';

const StyledCard = styled('div')(({theme}) => ({
  borderRadius: theme.shape.borderRadius,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'left',
  justifyContent: 'center',
  width: '100%', // Use 100% width by default for smaller screens
  maxWidth: '90vw', // Use a maximum of 90% of the viewport width
  marginTop: theme.spacing(3), // Smaller margin for smaller screens
  marginRight: theme.spacing(1), // Smaller margin for smaller screens
  [theme.breakpoints.up('sm')]: {
    maxWidth: '80vw', // Adjust maxWidth for small devices
    marginTop: theme.spacing(6),
    marginRight: theme.spacing(2),
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: '75vw', // Adjust maxWidth for medium devices
    marginTop: theme.spacing(12),
    marginRight: theme.spacing(3),
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: '70vw', // Adjust maxWidth for large devices
    marginTop: theme.spacing(16),
    marginRight: theme.spacing(4),
  },
}));

const motivationList = [
  'Gear Up for Glory',
  'Take the Wheel, Be Legendary',
  'Live the Thrill of the Race',
];

export const ExampleScrollText = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  // Define your scroll values for different screen sizes
  let scrollFromX;
  let scrollToX;

  // let scrollFromX_1;
  // let scrollToX_1;

  if (isXs) {
    // For extra-small devices
    scrollFromX = 0;
    scrollToX = 0;
    // scrollFromX_1 = -250;
    // scrollToX_1 = 250;
  } else if (isSm) {
    // For small devices
    scrollFromX = 0;
    scrollToX = 0;
    // scrollFromX_1 = -300;
    // scrollToX_1 = 300;
  } else if (isMd) {
    // For medium devices
    scrollFromX = 0;
    scrollToX = 0;
    // scrollFromX_1 = -400;
    // scrollToX_1 = 400;
  } else if (isLg) {
    // For large devices
    scrollFromX = 0;
    scrollToX = 0;
    // scrollFromX_1 = -500;
    // scrollToX_1 = 500;
  }
  return (
    <ScrollableArea>
      <div
        className="position-relative"
        style={{
          height: 150,
          marginBottom: 100,
        }}
      ></div>
      <ControlTranslate scrollFromX={scrollFromX} scrollToX={scrollToX}>
        <ControlRotate className="position-absolute" from={-1} to={0}>
          <div
            className="d-inline-block"
            style={{
              textAlign: 'left',
              marginBottom: 100,
              paddingTop: 10,
              fontSize: 'clamp(1.1em, 4.5vw, 2em)',
              lineHeight: '1.5em',
              color: '#C0C0C0',
            }}
          >
            <StyledCard>
              <AnimatedTypingText
                strings={motivationList}
                loop
                smartBackspace
                sx={{
                  fontSize: 'clamp(1em, 4.5vw, 2em)',
                  lineHeight: '1.5em',
                  fontWeight: 'bold',
                  color: '#A50000',
                }}
              />

              <p>
                Experience the thrill of drifting with Tigers Team! Our
                cutting-edge e-gaming and simulations bring the excitement right
                to you.
              </p>
              <p>
                Enjoy a top-notch drifting experience with our state-of-the-art
                technology and immersive environments.
              </p>
              <p>
                Come learn, play, and master the art of drifting with us and
                take your skills to new heights!
              </p>
            </StyledCard>
          </div>
        </ControlRotate>
      </ControlTranslate>
    </ScrollableArea>
  );
};

// const styles = {
//   fauxButtonLeft: {
//     right: 0,
//     border: "1px solid #8da8dd",
//     borderRadius: 8,
//     borderTopRightRadius: 0,
//     borderBottomRightRadius: 0,
//     borderRight: "none",
//     paddingLeft: 15,
//   },
//   fauxButtonRight: {
//     right: 0,
//     border: "1px solid #8da8dd",
//     borderRadius: 8,
//     borderTopLeftRadius: 0,
//     borderBottomLeftRadius: 0,
//     borderLeft: "none",
//     paddingRight: 15,
//   },
// };
