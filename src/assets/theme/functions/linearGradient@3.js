function linearGradient(
    color,
    colorState,
    position1 = '10%',
    position2 = '50%',
    position3 = '90%',
    angle = 195,
) {
  return `linear-gradient(${angle}deg, 
    ${color} ${position1}, ${colorState} ${position2}, ${color} ${position3})`;
}

export default linearGradient;
