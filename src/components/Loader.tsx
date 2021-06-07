import React from "react";
import styled, { keyframes } from "styled-components";

const animationSpin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const SpinLoader = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid gray;
  border-top: 3px solid rgb(219, 219, 219);
  border-radius: 50%;
  background-color: transparent;
  animation: ${animationSpin} 1s linear infinite;
`;

export const Loader: React.FC = () => {
  return <SpinLoader />;
};
