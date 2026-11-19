import React from 'react';
import productSurface from 'utils/productSurface';
import PropTypes from 'prop-types';
import { getCategorySectionId } from 'utils/productData.mjs';
import { getProductImageUrl } from 'utils/productImage';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import CategoryCard from 'examples/Cards/ProductCard/CategoryCard';
import BundlesIMG from 'assets/images/Categories/Bundles.webp';
import WheelBasesIMG from 'assets/images/Categories/WheelBases.webp';
import SteeringWheelsIMG from 'assets/images/Categories/Steering-Wheels.webp';
import Pedals from 'assets/images/Categories/Pedals.webp';
import Accessories from 'assets/images/Categories/Accessories.webp';
import Rigs from 'assets/images/Categories/Rigs.webp';
import Maps from 'assets/images/Categories/arena.webp';
import bg from 'assets/images/backGround/red_blackBG.webp';

import ScrollAnimation from 'utils/scrollAnimation';

const categoryImages = {
  bundles: BundlesIMG,
  'wheel bases': WheelBasesIMG,
  'steering wheels': SteeringWheelsIMG,
  pedals: Pedals,
  accessories: Accessories,
  rigs: Rigs,
  maps: Maps,
};

const Section = styled(Box)(({ theme }) => ({
  position: 'relative',
  boxSizing: 'border-box',
  width: '100%',
  minHeight: '100vh',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '& > *': {
    width: '100%',
    flexShrink: 0,
  },
  '@supports (min-height: 100dvh)': {
    minHeight: '100dvh',
  },
  overflow: 'hidden',
  padding: theme.spacing(14, 6, 6),
  ...productSurface,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(12, 3, 4),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(10, 1.5, 2),
  },
  '@media (max-height: 700px)': {
    paddingTop: theme.spacing(9),
    paddingBottom: theme.spacing(2),
  },
}));

const Heading = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  marginBottom: theme.spacing(6),
  textAlign: 'center',
  color: '#ffffff',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(3.5),
  },
  '@media (max-height: 700px)': { marginBottom: theme.spacing(3.5) },
}));

const Eyebrow = styled('div')({
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.3em',
  overflowWrap: 'anywhere',
  textTransform: 'uppercase',
  color: 'rgba(255, 255, 255, 0.85)',
  textShadow: '0 2px 12px rgba(0, 0, 0, 0.9)',
});

const Title = styled('h1')({
  margin: '12px 0 0',
  fontSize: 'clamp(1.8rem, 4.4vw, 3.6rem)',
  fontWeight: 900,
  lineHeight: 1.05,
  letterSpacing: '-0.01em',
  textTransform: 'uppercase',
  color: '#ffffff',
  textShadow: '0 4px 24px rgba(0, 0, 0, 0.9)',
  '@media (max-height: 700px)': { fontSize: 'clamp(1.6rem, 4vw, 2.5rem)' },
});

const TitleLine = styled('div')({
  width: '72px',
  height: '4px',
  margin: '16px auto 0',
  borderRadius: '2px',
  backgroundColor: '#d40000',
});

const CategoryGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
  gap: theme.spacing(2),
  maxWidth: '1200px',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: theme.spacing(1.25),
  },
  '@media (max-width: 379px)': { gridTemplateColumns: 'minmax(0, 1fr)' },
}));

const CategoriesSection = ({
  categories = [],
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <Section>
      <Heading>
        <Eyebrow>Tigers Team Racing</Eyebrow>
        <Title>Shop by category</Title>
        <TitleLine />
      </Heading>
      <ScrollAnimation>
        <CategoryGrid>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              image={getProductImageUrl(
                category.img_url,
                categoryImages[category.name.trim().toLowerCase()] || bg,
              )}
              fallbackImage={
                categoryImages[category.name.trim().toLowerCase()] || bg
              }
              selected={category.id === selectedCategoryId}
              onSelect={() => onSelectCategory(category.id)}
              name={category.name}
              link={`#${getCategorySectionId(category)}`}
            />
          ))}
        </CategoryGrid>
      </ScrollAnimation>
    </Section>
  );
};

CategoriesSection.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      img_url: PropTypes.string,
    }),
  ),
  selectedCategoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelectCategory: PropTypes.func.isRequired,
};

export default CategoriesSection;
