import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const HOVER_QUERY = '@media (hover: hover)';
const REDUCED_MOTION_QUERY = '@media (prefers-reduced-motion: reduce)';

const Card = styled('a')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  boxSizing: 'border-box',
  width: '100%',
  overflow: 'hidden',
  padding: theme.spacing(1.25, 2, 1.25, 1.25),
  textDecoration: 'none',
  color: '#ffffff',
  background: 'rgba(8, 8, 10, 0.72)',
  border: '1px solid rgba(255, 255, 255, 0.16)',
  borderRadius: '18px',
  backdropFilter: 'blur(14px) saturate(140%)',
  WebkitBackdropFilter: 'blur(14px) saturate(140%)',
  transition: `transform 0.5s ${EASING}, border-color 0.4s ease`,
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    height: '3px',
    backgroundColor: '#d40000',
    transformOrigin: 'left',
    transform: 'scaleX(0)',
    transition: `transform 0.6s ${EASING}`,
  },
  '&:focus-visible': {
    outline: '2px solid #ffffff',
    outlineOffset: '3px',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    '& .category-thumb': { gridColumn: 1, gridRow: 1 },
    '& .category-name': { gridColumn: '1 / -1', gridRow: 2 },
    '& .category-arrow': { gridColumn: 2, gridRow: 1, alignSelf: 'start' },
    gap: theme.spacing(1.5),
    padding: theme.spacing(1, 1.5, 1, 1),
    borderRadius: '14px',
  },
  [HOVER_QUERY]: {
    '&:hover': {
      transform: 'translateY(-4px)',
      borderColor: 'rgba(255, 255, 255, 0.4)',
      '&::after': {
        transform: 'scaleX(1)',
      },
      '& .category-image': {
        transform: 'scale(1.1)',
      },
      '& .category-arrow': {
        transform: 'translate(3px, -3px)',
        opacity: 1,
      },
    },
  },
  [REDUCED_MOTION_QUERY]: {
    transition: 'none',
  },
}));

const Thumb = styled(Box)(({ theme }) => ({
  flex: '0 0 auto',
  width: '64px',
  height: '64px',
  overflow: 'hidden',
  borderRadius: '14px',
  backgroundColor: '#111111',
  [theme.breakpoints.down('sm')]: {
    width: '58px',
    height: '58px',
    borderRadius: '10px',
  },
  '@media (max-height: 700px)': {
    width: '50px',
    height: '50px',
  },
}));

const ThumbImage = styled('img')({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: `transform 0.8s ${EASING}`,
});

const Label = styled(Typography)(({ theme }) => ({
  flex: '1 1 auto',
  minWidth: 0,
  overflowWrap: 'anywhere',
  fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
  fontWeight: 900,
  letterSpacing: '0.025em',
  textTransform: 'uppercase',
  lineHeight: 1.15,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.82rem',
    letterSpacing: '0.04em',
  },
}));

const CategoryCard = ({
  image,
  name,
  link,
  fallbackImage,
  selected = false,
  onSelect,
}) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Card
      href={link}
      aria-label={name}
      aria-current={selected ? 'true' : undefined}
      onClick={(event) => {
        if (onSelect) {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <Thumb className="category-thumb">
        <ThumbImage
          className="category-image"
          src={image}
          alt={name}
          onError={(event) => {
            if (
              fallbackImage &&
              event.currentTarget.getAttribute('src') !== fallbackImage
            ) {
              event.currentTarget.src = fallbackImage;
            }
          }}
        />
      </Thumb>
      <Label component="span" className="category-name">
        {name}
      </Label>
      <ArrowOutwardRoundedIcon
        className="category-arrow"
        fontSize={isLargeScreen ? 'medium' : 'small'}
        sx={{
          opacity: 0.6,
          flexShrink: 0,
          marginLeft: 0.5,
          transition: `transform 0.4s ${EASING}, opacity 0.3s ease`,
        }}
      />
    </Card>
  );
};

CategoryCard.propTypes = {
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
  fallbackImage: PropTypes.string,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default CategoryCard;
