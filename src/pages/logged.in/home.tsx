import React from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";

import { LayoutContainer } from "../../components/LayoutContainer";
import { PageLoader } from "../../components/Loader";
import { AllShops, AllShopsVariables } from "../../codegen/AllShops";
import { HelmetOnlyTitle } from "../../components/HelmetOnlyTitle";
import { device } from "../../theme/theme";
import { QUERY_SHOPS } from "../../apollo/queries";
import { CafeItem } from "../../components/CafeItem";

const Container = styled(LayoutContainer)`
  flex-direction: column;
  ${device.xs} {
    padding-left: 5px;
    padding-right: 5px;
  }
`;

export const HomePage = () => {
  const { data, loading } = useQuery<AllShops, AllShopsVariables>(QUERY_SHOPS);

  return (
    <Container>
      <HelmetOnlyTitle title="Home" />
      {loading && <PageLoader />}
      {!loading &&
        data &&
        data.seeCoffeeShops?.map((shop) => (
          <CafeItem shop={shop!} key={shop?.id} />
        ))}
    </Container>
  );
};
