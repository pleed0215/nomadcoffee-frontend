import React, { useState } from "react";
import styled, { css } from "styled-components";
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
  max-height: 600px;
  padding-top: 8px;
  background-color: ${(props) => props.theme.background.primary};
  /* 스크롤바 감추기 */
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  overflow-y: scroll;
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
  height: 180px;
  border-top: 1px solid ${(props) => props.theme.color.border};
  border-bottom: 1px solid ${(props) => props.theme.color.border};
`;
const PhotoContentContainer = styled.div`
  width: 300px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  ${device.xs} {
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
    /* 스크롤바 감추기 */
    ::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  overflow-x: scroll;
`;
const Thumbnail = styled.div<{ url?: string; selected?: boolean }>`
  width: 150px;
  height: 150px;
  background-position: center center;
  background-size: cover;
  background-image: url(${(props) => props.url});

  cursor: pointer;
  ${(props) =>
    props.selected &&
    css`
      backdrop-filter: blur(10px);
      opacity: 0.3;
    `}
`;

export const CafeItem: React.FC<CafeItemProps> = ({ shop }) => {
  const kakao = window.kakao;
  const [photo, setPhoto] = useState(shop.firstPhotoUrl);

  const onPhotoClick = (url: string) => (_: React.MouseEvent) => {
    if (url === photo) {
      setPhoto(shop.firstPhotoUrl);
    } else {
      setPhoto(url);
    }
  };

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
            id={shop.user?.id!}
            username={shop.user?.username!}
            email={shop.user?.email}
            linkable
            textColor={"white"}
          />
        </Header>
        <Body>
          <PhotoArea>
            <Photo url={photo!} />
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
            {shop.photos && shop.photos.length > 1 && (
              <>
                <p style={{ marginTop: 4, marginBottom: 8 }}>사진</p>
                <PhotoContentContainer>
                  {shop.photos.slice(1).map((p) => (
                    <Thumbnail
                      key={`Thumbnail:${p?.id}`}
                      url={p?.url!}
                      selected={p?.url === photo}
                      onClick={onPhotoClick(p?.url!)}
                    />
                  ))}
                </PhotoContentContainer>
              </>
            )}
          </ContentArea>
        </Body>
      </PhotoItemWrapper>
    </>
  );
};
