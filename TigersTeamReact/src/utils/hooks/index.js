import { useMediaQuery } from '@mui/material';

const useIsMobile = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  return isMobile;
};

const useMediumScreen = () => {
  const isMedium = useMediaQuery('(max-width:800px)');
  return isMedium;
};

export { useIsMobile, useMediumScreen };
