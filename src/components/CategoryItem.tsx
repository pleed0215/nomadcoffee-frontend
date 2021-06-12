import { useLazyQuery } from "@apollo/client";
import React from "react";
import Popup from "reactjs-popup";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { QUERY_SEE_CATEGORY } from "../apollo/queries";
import { SeeCategory, SeeCategoryVariables } from "../codegen/SeeCategory";

type CategoryItemProps = {
  slug: string;
};

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
  cursor: pointer;
`;

const CategoryText = styled.span`
  margin-right: 5px;
`;

const Container = styled.div`
  width: 200px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.color.primary};
  border: 1px solid ${(props) => props.theme.color.border};
  border-radius: 8px;
  overflow-y: scroll;
  /* 스크롤바 감추기 */
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

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
    background-color: #BBB;
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

export const CategoryItem: React.FC<CategoryItemProps> = ({ slug }) => {
  const [getData, { data, loading }] = useLazyQuery<
    SeeCategory,
    SeeCategoryVariables
  >(QUERY_SEE_CATEGORY, { variables: { slug } });
  return (
    <Popup
      on={["hover", "click"]}
      mouseEnterDelay={300}
      mouseLeaveDelay={500}
      position="left center"
      trigger={
        <CategoryContainer>
          <CategoryText>{slug}</CategoryText>
        </CategoryContainer>
      }
      onOpen={() => getData()}
    >
      {data && !loading && (
        <Container>
          <span style={{ textAlign: "center", marginBottom: 4 }}>
            #{slug}
          </span>
          {data.seeCategory?.map((shop) => (
            <CafeContainer
              to={`/shop/${shop?.id}`}
              key={`Cat:${slug}-${shop?.id}`}
            >
              <CafePhoto url={shop?.firstPhotoUrl!} />
              <CafeName>{shop?.name}</CafeName>
            </CafeContainer>
          ))}
        </Container>
      )}
    </Popup>
  );
};
