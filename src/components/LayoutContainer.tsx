import React from "react";
import styled from "styled-components";
import { device, breakpoints } from "../theme/theme";

const Container = styled.div`
  ${device.xs} {
    min-width: ${breakpoints.xs};
  }
  ${device.sm} {
    max-width: ${breakpoints.sm};
  }
  ${device.md} {
    max-width: ${breakpoints.md};
  }
  ${device.lg} {
    max-width: ${breakpoints.lg};
  }
  /*@media ${device.xl} {
    max-width: ${breakpoints.xl};
  }*/
  display: flex;
  width: 100%;
`;

export const LayoutContainer: React.FC<any> = ({ children, ...props }) => {
  return <Container {...props}>{children}</Container>;
};