import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
const CafeContainer = styled(Link)`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 4px;
  }
  outline: none;
  padding: 0px 1px;
  border-radius: 4px;
  &:hover {
    background-color: #bbb;
  }
`;

const CafePhoto = styled.div<{ url: string }>`
  width: 40px;
  height: 40px;
  margin-right: 4px;
  background-image: url(${(props) => props.url});
  background-size: cover;
  background-position: center center;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.color.border};
`;

const CafeName = styled.span``;

type SmallCafeItemProps = {
  id: number;
  name: string;
  url: string;
};

export const SmallCafeItem: React.FC<SmallCafeItemProps> = ({
  id,
  name,
  url,
}) => {
  return (
    <CafeContainer to={`/shop/${id}`}>
      <CafePhoto url={url} />
      <CafeName>{name}</CafeName>
    </CafeContainer>
  );
};
