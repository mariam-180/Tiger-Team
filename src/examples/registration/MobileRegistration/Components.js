import styled from 'styled-components';

export const SignUpContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 100%;
  transform: translateX(100%);
  opacity: 0;
  z-index: 1;
  ${(props) =>
    props.signingin !== true
      ? `
    transform: translateX(0%);
    opacity: 1;
    z-index: 5;
  `
      : null}
`;

export const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  opacity: 1;
  width: 100%;
  z-index: 2;
  ${(props) =>
    props.signingin !== true
      ? `
  transform: translateX(-100%);
  opacity: 0;
  z-index: 5;
`
      : null}
`;

export const Row = styled.div`
  display: flex;
  gap: 10px; // Adjust the gap as needed
  margin-bottom: 15px; // Adds some space below the row
  height: 5%;
  width: 120%;
`;

export const Form = styled.form`
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  padding: 15px;
  border-radius: 15px;
  color: #000;
`;

export const Input = styled.input`
  background-color: #eee;
  font-size: 16px;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  height: 5%;
  width: 120%;
`;

export const RowInput = styled.input`
  background-color: #eee;
  font-size: 16px;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  height: 100%;
  width: 100%;
`;

export const Button = styled.button`
  background: linear-gradient(45deg, #000000 30%, #ff0000 90%);
  color: #ffffff;
  padding: 12px 45px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: none;
  box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
  border-radius: 20px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 1px solid #ff4b2b;
  transition:
    background 0.5s ease,
    box-shadow 0.5s ease,
    transform 80ms ease-in;

  &:hover {
    box-shadow: 0 5px 7px 2px rgba(255, 105, 135, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
  }
`;

export const Anchor = styled.a`
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
  transition: color 0.3s ease;

  &:hover {
    color: #ff4b2b;
  }
`;
