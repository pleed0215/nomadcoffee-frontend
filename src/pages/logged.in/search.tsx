import { gql, useLazyQuery } from "@apollo/client";
import { faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { ALL_USER, PART_SHOP } from "../../apollo/fragments";
import {
  SearchCategory,
  SearchCategoryVariables,
} from "../../codegen/SearchCategory";
import { SearchShops, SearchShopsVariables } from "../../codegen/SearchShops";
import { SearchUsers, SearchUsersVariables } from "../../codegen/SearchUsers";
import { AvatarAndUsername } from "../../components/Avatar";
import { CategoryItem } from "../../components/CategoryItem";
import { HelmetOnlyTitle } from "../../components/HelmetOnlyTitle";
import { LayoutContainer } from "../../components/LayoutContainer";
import { PageLoader } from "../../components/Loader";
import { SmallCafeItem } from "../../components/SmallCafeItem";
import { useQueryParam } from "../../hooks/useQueryParams";
import { device } from "../../theme/theme";

const QUERY_SEARCH_USER = gql`
  query SearchUsers($term: String!) {
    searchUsers(term: $term) {
      total
      results {
        ...AllUser
      }
    }
  }
  ${ALL_USER}
`;

const QUERY_SEARCH_SHOPS = gql`
  query SearchShops($term: String!) {
    searchShopsByTerm(term: $term) {
      ...PartShop
    }
  }
  ${PART_SHOP}
`;

const QUERY_SEARCH_CATEGORY = gql`
  query SearchCategory($term: String!) {
    searchCategoriesByTerm(term: $term) {
      id
      name
      slug
      totalShops
      shops {
        ...PartShop
      }
    }
  }
  ${PART_SHOP}
`;

const Container = styled(LayoutContainer)`
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.background.primary};
  ${device.xs} {
    padding: 5px;
  }
`;

const SearchContainer = styled.form`
  width: 80%;

  position: relative;
  display: flex;
  align-items: center;
`;

const IconSearch = styled(FontAwesomeIcon)`
  position: absolute;
  left: 5px;
  color: darkgray;
`;
const IconReset = styled(FontAwesomeIcon)`
  position: absolute;
  right: 5px;
  color: darkgray;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 5px 10px 5px 20px;
  border-radius: 5px;
  outline: none;
  background-color: #efefef;
  border: 1px solid ${(props) => props.theme.color.border};
  font-size: 12px;
`;

const Seperator = styled.div`
  width: 100%;
  border: 1px solid ${(props) => props.theme.color.border};
  margin-top: 24px;
  margin-bottom: 8px;
`;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SearchResultText = styled.h4`
  font-size: 1.5rem;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const ResultText = styled.h6`
  font-size: 1rem;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const ResultName = styled.h6`
  font-size: 1rem;
  font-style: italic;
  margin-top: 16px;
`;

const UserSearchContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.color.border};
  padding: 8px 16px;
  margin-top: 8px;
  margin-bottom: 8px;
`;
const ShopSearchContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.color.border};
  padding: 8px 16px;
  margin-top: 8px;
  margin-bottom: 8px;
`;
const CategorySearchContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.color.border};
  padding: 8px 16px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

export const SearchPage: React.FC = () => {
  const [term, setTerm] = useState(useQueryParam().get("term") || "");
  const [findTerm] = useState(useQueryParam().get("term") || "");
  const theme = useTheme();

  const [searchUsers, { data: usersSearch, loading: usersLoading }] =
    useLazyQuery<SearchUsers, SearchUsersVariables>(QUERY_SEARCH_USER);
  const [searchShops, { data: shopsSearch, loading: shopsLoading }] =
    useLazyQuery<SearchShops, SearchShopsVariables>(QUERY_SEARCH_SHOPS);
  const [
    searchCategories,
    { data: categoriesSearch, loading: categoriesLoading },
  ] = useLazyQuery<SearchCategory, SearchCategoryVariables>(
    QUERY_SEARCH_CATEGORY
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.currentTarget.value);
  };

  useEffect(() => {
    if (findTerm !== "" && findTerm.length > 1) {
      searchUsers({ variables: { term: findTerm } });
      searchCategories({ variables: { term: findTerm } });
      searchShops({ variables: { term: findTerm } });
    }
  }, [findTerm, searchUsers, searchCategories, searchShops]);

  return (
    <Container>
      <HelmetOnlyTitle
        title={!term && term !== "" ? `${term} 검색` : "검색하기"}
      />
      <SearchContainer method="GET" action="/search">
        <IconSearch icon={faSearch} size="xs" />
        <SearchInput
          value={term}
          onChange={onChange}
          type="text"
          placeholder="검색"
          name="term"
        />
        <IconReset icon={faTimesCircle} size="xs" onClick={() => setTerm("")} />
      </SearchContainer>
      {findTerm !== "" && (
        <>
          <Seperator />
          <ResultContainer>
            <SearchResultText>
              {usersLoading || categoriesLoading || shopsLoading
                ? `'${findTerm}' 검색중 ...`
                : `'${findTerm}' 검색 결과`}
            </SearchResultText>

            <ResultName>유저 검색 결과</ResultName>
            <UserSearchContainer>
              {usersLoading && <PageLoader />}
              {!usersLoading && usersSearch && (
                <>
                  <ResultText>
                    {usersSearch.searchUsers.total !== 0
                      ? `${usersSearch.searchUsers.total}명 찾음`
                      : "검색 결과 없음."}
                  </ResultText>
                  <div style={{ display: "flex" }}>
                    {usersSearch.searchUsers.results?.map((user) => (
                      <>
                        {user && (
                          <div
                            key={`User:${user.id}`}
                            style={{
                              marginRight: "4px",
                              marginBottom: "4px",
                            }}
                          >
                            <AvatarAndUsername
                              id={user.id}
                              username={user.username}
                              email={user.email}
                              url={user.avatarURL}
                              size="lg"
                              textColor={theme.color.primary}
                              linkable
                            />
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                </>
              )}
            </UserSearchContainer>
            <ResultName>카페 검색 결과</ResultName>
            <ShopSearchContainer>
              {shopsLoading && <PageLoader />}
              {!shopsLoading && shopsSearch && (
                <>
                  <ResultText>
                    {shopsSearch.searchShopsByTerm?.length !== 0
                      ? `${shopsSearch.searchShopsByTerm?.length}개 카페 찾음`
                      : "검색 결과 없음."}
                  </ResultText>
                  <div style={{ display: "flex" }}>
                    {shopsSearch.searchShopsByTerm?.map((shop) => (
                      <div
                        key={`CoffeeShop:${shop?.id}`}
                        style={{ marginRight: 4, marginBottom: 4 }}
                      >
                        <SmallCafeItem
                          id={shop?.id!}
                          name={shop?.name!}
                          url={shop?.firstPhotoUrl!}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ShopSearchContainer>
            <ResultName>카테고리 검색 결과</ResultName>
            <CategorySearchContainer>
              {categoriesLoading && <PageLoader />}
              {!categoriesLoading && categoriesSearch && (
                <>
                  <ResultText>
                    {categoriesSearch.searchCategoriesByTerm?.length !== 0
                      ? `${categoriesSearch.searchCategoriesByTerm?.length}개 카테고리 찾음`
                      : "검색 결과 없음."}
                  </ResultText>
                  <div style={{ display: "flex" }}>
                    {categoriesSearch.searchCategoriesByTerm?.map(
                      (category) => (
                        <div
                          key={`Category:${category?.id}`}
                          style={{ marginRight: 4, marginBottom: 4 }}
                        >
                          <CategoryItem slug={category?.slug!} />
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </CategorySearchContainer>
          </ResultContainer>
        </>
      )}
    </Container>
  );
};
