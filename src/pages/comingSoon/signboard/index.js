import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Signboard = styled.div`
  position: relative;
  background-color: #fff;
  padding: 20px 40px;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #f00;
  box-shadow: -25px 25px 18px rgba(200, 0, 0, 0.5);
  border-radius: 20px;

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    width: 100px;
    height: 6px;
    background: #fff;
  }

  &:before {
    left: -110px;
    // box-shadow: 60px 25px 10px #000, 10px 0 0 #000;
  }

  &:after {
    right: -110px;
    // box-shadow: -60px 25px 10px #000, 10px 0 0 #000;
  }
`;

const ComingSoon = () => {
  return (
    <Container>
      <Signboard>Coming soon</Signboard>
    </Container>
  );
};

export default ComingSoon;
