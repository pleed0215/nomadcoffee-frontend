import React from "react";
import styled from "styled-components";

// reference from: https://www.w3schools.com/howto/howto_css_switch.asp

const Container = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
`;

const SpanSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;
  &::before {
    position: absolute;
    content: "";
    height: 24px;
    width: 24px;
    left: 3px;
    bottom: 3px;
    border-radius: 50%;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
`;

const CheckBox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  &:checked + ${SpanSlider} {
    background-color: #9400d3;
  }
  &:checked + ${SpanSlider}::before {
    -webkit-transform: translateX(28px);
    -ms-transform: translateX(28px);
    transform: translateX(28px);
  }
`;

interface ToggleSwitchProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  defaultChecked: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  onChange,
  defaultChecked,
}) => {
  return (
    <Container>
      <CheckBox
        type="checkbox"
        onChange={onChange}
        defaultChecked={defaultChecked}
      />
      <SpanSlider />
    </Container>
  );
};
