import React from "react";
import styled from "styled-components";
import { breakpoints, device } from "../theme/theme";

import { AvatarAndUsername } from "./Avatar";
import { AllShop } from "../codegen/AllShop";
import { Map, Marker } from "react-kakao-maps";
import { Link } from "react-router-dom";

interface CafeItemProps {
  shop: AllShop;
}

const PhotoItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  border: 1px solid ${(props) => props.theme.color.border};
  margin-bottom: 60px;
  min-height: 60px;
`;

const Photo = styled.div<{ url?: string }>`
  ${device.sm} {
    min-height: ${breakpoints.sm};
  }
  ${device.xs} {
    min-height: ${breakpoints.xs};
  }
  width: 100%;
  background-position: center center;
  background-size: cover;
  background-image: url(${(props) => props.url});
`;

const PhotoContentContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background-color: ${(props) => props.theme.background.secondary};
  color: ${(props) => props.theme.background.secondary};
`;

const HeaderTitle = styled.h4`
  font-size: 1.4rem;
  color: ${(props) => props.theme.color.secondary};
`;
const Body = styled.div`
  display: flex;
  ${device.xs} {
    flex-direction: column;
  }
  width: 100%;
  height: 100%;
`;

const PhotoArea = styled.div`
  ${device.xs} {
    width: 100%;
  }
  width: 70%;
`;

const ContentArea = styled.div`
  ${device.xs} {
    width: 100%;
    max-width: none;
    min-height: 500px;
  }
  width: 100%;
  height: 100%;
  max-width: 300px;
  min-height: 600px;
  padding: 8px 0px;
  background-color: ${(props) => props.theme.background.primary};
`;

const CategoryContainer = styled.div`
  width: 100px;
  height: 30px;
  padding: 3px 5px;
  background-color: ${(props) => props.theme.background.secondary};
  color: ${(props) => props.theme.color.secondary};
  font-size: 1rem;
  border-radius: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  &:not(:last-child) {
    margin-right: 10px;
  }
  margin-top: 4px;
  margin-bottom: 4px;
`;

const Categories = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 0 8px;
`;

const CategoryText = styled.span`
  margin-right: 5px;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 250px;
  border-top: 1px solid ${(props) => props.theme.color.border};
  border-bottom: 1px solid ${(props) => props.theme.color.border};
`;

export const CafeItem: React.FC<CafeItemProps> = ({ shop }) => {
  const kakao = window.kakao;
  console.log(shop);
  return (
    <>
      <PhotoItemWrapper>
        <Header>
          <HeaderTitle>
            <Link to={`/shop/${shop.id}`}>{shop.name}</Link>
          </HeaderTitle>
          <AvatarAndUsername
            url={shop.user?.avatarURL}
            size="lg"
            username={shop.user?.username!}
            email={shop.user?.email}
            linkable
            textColor={"white"}
          />
        </Header>
        <Body>
          <PhotoArea>
            <Photo url={shop.firstPhotoUrl!} />
          </PhotoArea>
          <ContentArea>
            <span style={{ paddingLeft: 8 }}>위치: {shop.address}</span>
            <MapContainer>
              <Map
                options={{
                  center: new kakao.maps.LatLng(+shop.lat!, +shop.lng!),
                }}
              >
                <Marker
                  options={{
                    position: new kakao.maps.LatLng(+shop.lat!, +shop.lng!),
                  }}
                />
              </Map>
            </MapContainer>
            <p style={{ paddingLeft: 8, marginTop: 8 }}>카테고리</p>
            <Categories>
              {shop.categories?.map((category) => (
                <CategoryContainer key={`Shop:${shop.id}-${category?.slug}`}>
                  <CategoryText>{category?.slug}</CategoryText>
                </CategoryContainer>
              ))}
            </Categories>
          </ContentArea>
        </Body>
        <PhotoContentContainer></PhotoContentContainer>
      </PhotoItemWrapper>
    </>
  );
};
