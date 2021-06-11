import { useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { QUERY_SEE_CAFE } from "../../apollo/queries";
import { SeeCafe, SeeCafeVariables } from "../../codegen/SeeCafe";
import { CafeItem } from "../../components/CafeItem";
import { LayoutContainer } from "../../components/LayoutContainer";
import { PageLoader } from "../../components/Loader";
import { AddOrEditPage } from "./cafe";

const Container = styled(LayoutContainer)`
  flex-direction: column;
`;

export const SeeCafePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useQuery<SeeCafe, SeeCafeVariables>(
    QUERY_SEE_CAFE,
    {
      skip: !Boolean(id),
      variables: {
        id: +id!,
      },
    }
  );

  return (
    <>
      {loading && <PageLoader />}
      {!loading && data?.seeCoffeeShop?.isMine && (
        <AddOrEditPage editing shop={data.seeCoffeeShop} />
      )}
      {!loading && !data?.seeCoffeeShop?.isMine && (
        <Container>
          <CafeItem shop={data?.seeCoffeeShop!} />
        </Container>
      )}
    </>
  );
};
