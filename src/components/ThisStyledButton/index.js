import {styled} from '@mui/material/styles';
import {Button} from '@mui/material';

export const StyledButton = styled(Button)(({sx}) => ({
  'background': 'linear-gradient(45deg, #000000 30%, #FF0000 90%)',
  'color': '#ffffff',
  'padding': '12px 45px',
  'fontSize': '12px',
  'fontWeight': 'bold',
  'textTransform': 'none',
  'boxShadow': '0 3px 5px 2px rgba(255, 105, 135, .3)',
  'borderRadius': '20px',
  'letterSpacing': '1px',
  'textTransform': 'uppercase',
  'border': '1px solid #ff4b2b',
  'transition':
    'background 0.5s ease, box-shadow 0.5s ease, transform 80ms ease-in',
  '&:hover': {
    boxShadow: '0 5px 7px 2px rgba(255, 105, 135, .4)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  '&:focus': {
    outline: 'none',
  },
  ...sx,
}));
