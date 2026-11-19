import Typography from '@mui/material/Typography';
import { styled, keyframes } from '@mui/material/styles';

const shinyAnimation = keyframes`
0% {
  background-position: -500px;

25% {
  background-position: 500px;
  50% {
    background-position: 500px;
    75% {
      background-position: -500px;

100% {
  background-position: -500px;
}
`;

const wavingColorAnimation = keyframes`
  0% {
    color: #FF5349;
    /*transform: translateY(0); /* Starting position */
  }
  25% {
    color: #121314;
    /*transform: translateY(-10px); /* Move up */
  }
  50% {
    color: #FF5349;
    /*transform: translateY(0); /* Back to starting position */
  }
  75% {
    color: #121314;
    /*transform: translateY(10px); /* Move down */
  }
  100% {
    color: #FF5349;
    /*transform: translateY(0); /* Back to starting position */
  }
`;

export default styled(Typography)(({ theme, ownerState }) => {
  const { palette, typography, functions } = theme;
  const {
    color,
    textTransform,
    verticalAlign,
    fontWeight,
    opacity,
    textGradient,
  } = ownerState;

  const { gradients, transparent } = palette;
  const {
    fontWeightLight,
    fontWeightRegular,
    fontWeightMedium,
    fontWeightBold,
  } = typography;
  const { linearGradient } = functions;

  // fontWeight styles
  const fontWeights = {
    light: fontWeightLight,
    regular: fontWeightRegular,
    medium: fontWeightMedium,
    bold: fontWeightBold,
  };

  // styles for the typography with textGradient={true}
  const gradientStyles = () => ({
    backgroundImage:
      color !== 'inherit' &&
      color !== 'text' &&
      color !== 'white' &&
      gradients[color]
        ? linearGradient(gradients[color].main, gradients[color].state)
        : linearGradient(gradients.dark.main, gradients.dark.state),
    display: 'inline-block',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: transparent.main,
    position: 'relative',
    zIndex: 1,
  });

  const shinyEffect = {
    background:
      'linear-gradient(90deg, rgba(255,255,255,0) 0%,' +
      'rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
    backgroundSize: '200% auto',
    color: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'red',
    animation: `${shinyAnimation} 5s linear infinite`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const wavingEffect = {
    animation: `${wavingColorAnimation} 7s linear infinite alternate`,
  };

  // color value
  const colorValue =
    color === 'inherit' || !palette[color] ? 'inherit' : palette[color].main;

  return {
    opacity,
    textTransform,
    verticalAlign,
    textDecoration: 'none',
    color: colorValue,
    letterSpacing: '-0.125px',
    fontWeight: fontWeights[fontWeight] && fontWeights[fontWeight],
    ...(textGradient && gradientStyles()),
    ...(ownerState.shiny && shinyEffect),
    ...(ownerState.waving && wavingEffect),
  };
});
