// SimpleButton.js
import { styled } from '@mui/system';
import Button from '@mui/material/Button';

const SimpleButton = styled(Button)({
  backgroundColor: '#35465c',
  color: '#fff !IMPORTANT',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
  padding: '10px 20px',
  borderRadius: '5px',
});

export default SimpleButton;
