/* eslint-disable react/no-unknown-property */
import React, {useEffect} from 'react';
import Plx from 'react-plx';

// eslint-disable-next-line max-len
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import bg from 'assets/images/parallax/trees.png';
import background from 'assets/images/tigers_ai/tigersTeamCar.webp';

export default function ParallaxComponent() {
  useEffect(() => {
    const originalStyles = {
      overscrollBehavior: document.body.style.overscrollBehavior,
      fontFamily: document.body.style.fontFamily,
      textAlign: document.body.style.textAlign,
      background: document.body.style.background,
      height: document.body.style.height,
    };

    document.body.style.overscrollBehavior = 'none';
    document.body.style.fontFamily = 'Arial Black, sans-serif';
    document.body.style.textAlign = 'center';
    document.body.style.background = '#000';
    document.body.style.height = '200vh';

    return () => {
      document.body.style.overscrollBehavior =
        originalStyles.overscrollBehavior;
      document.body.style.fontFamily = originalStyles.fontFamily;
      document.body.style.textAlign = originalStyles.textAlign;
      document.body.style.background = originalStyles.background;
      document.body.style.height = originalStyles.height;
    };
  }, []);

  return (
    <div>
      <Plx
        parallaxData={[
          {
            start: 0,
            end: 400,
            easing: 'easeInCubic',
            properties: [
              {
                startValue: 1.4,
                endValue: 8.5,
                property: 'scale',
              },
              {
                startValue: 1,
                endValue: 0,
                property: 'opacity',
              },
            ],
          },
        ]}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100%',
          height: '100vh',
          zIndex: 2,
        }}
      >
        <img
          style={{width: '100%', height: '100vh'}}
          src={bg}
          alt="foreground"
        />
      </Plx>

      <Plx
        parallaxData={[
          {
            start: 0,
            end: 800,
            properties: [
              {
                startValue: 1,
                endValue: 1.18,
                property: 'scale',
              },
              {
                startValue: 1,
                endValue: 0,
                property: 'opacity',
              },
            ],
          },
        ]}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100%',
          zIndex: 1,
        }}
      >
        <img
          style={{width: '100%', height: '100vh'}}
          src={background}
          alt="background"
        />
      </Plx>
      <Plx
        parallaxData={[
          {
            start: 0,
            duration: 800,
            properties: [
              {
                startValue: 0,
                endValue: 300,
                property: 'translateY',
              },
              {
                startValue: 1,
                endValue: 0,
                property: 'opacity',
              },
            ],
          },
        ]}
        style={{
          position: 'fixed',
          left: 0,
          top: '30%',
          width: '100%',
          zIndex: 3,
        }}
      >
        <div
          style={{
            color: '#A50000',
            textAlign: 'center',
            animation: 'bounce 2s infinite',
          }}
        >
          Scroll Down
          <br />
          <KeyboardDoubleArrowDownIcon sx={{fontSize: 60, color: '#000'}} />
        </div>

        <style jsx="true">
          {`
            @keyframes bounce {
              0%,
              20%,
              50%,
              80%,
              100% {
                transform: translateY(0);
              }
              40% {
                transform: translateY(-30px);
              }
              60% {
                transform: translateY(-15px);
              }
            }
          `}
        </style>
      </Plx>
    </div>
  );
}
