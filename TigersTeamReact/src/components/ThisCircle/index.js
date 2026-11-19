import React from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const spinRight = keyframes`
from {
  transform: translateX(0px)  rotate(230deg);
}
to {
  transform: translateX(50px) rotate(-50deg);
}
`;

const spinLeft = keyframes`
  from {
    transform: translateX(50px) rotate(-50deg);
  }
  to {
    transform: translateX(0) rotate(230deg);
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const Title = styled.h6`
  margin-bottom: 0;
  padding-bottom: 3px;
  span {
    padding: 0 20px;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 1.5rem;
    color: #c4c3ca;
    font-family: 'Poppins', sans-serif;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  left: -9999px;
`;

const CheckboxLabel = styled.label`
  position: relative;
  display: block;
  text-align: center;
  width: 70px;
  height: 18px;
  border-radius: 8px;
  padding: 0;
  margin: 10px auto;
  cursor: pointer;
  background-color: #ffeba7;
  .icon {
    position: absolute;
    top: -2px;
    left: -1px;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #102770;
    color: #ffeba7;
    font-size: 24px;
    transition: transform 0.5s ease;
    animation: ${spinLeft} 0.5s forwards;
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      border-radius: 90%;
      background-color: #102770;
    }
  }
  ${Checkbox}:checked + & .icon {
    animation: ${spinRight} 0.5s forwards;
  }
`;

const LoginSignupToggle = ({ isChecked, handleToggle }) => {
  return (
    <Container>
      <Title>
        <span>Log In</span>
        <span>Sign Up</span>
      </Title>
      <Checkbox id="reg-log" checked={isChecked} onChange={handleToggle} />
      <CheckboxLabel htmlFor="reg-log">
        <FontAwesomeIcon icon={faArrowRight} className="icon" />
      </CheckboxLabel>
    </Container>
  );
};

LoginSignupToggle.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
};

export default LoginSignupToggle;
