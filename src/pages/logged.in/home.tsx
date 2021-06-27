import React, { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";

import { PageLoader } from "../../components/Loader";
import { AllShops, AllShopsVariables } from "../../codegen/AllShops";
import { HelmetOnlyTitle } from "../../components/HelmetOnlyTitle";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { breakpoints, device } from "../../theme/theme";
import { QUERY_SHOPS } from "../../apollo/queries";
import { CafeItem } from "../../components/CafeItem";

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
  min-height: 100vh;

  flex-direction: column;
  ${device.xs} {
    padding-left: 5px;
    padding-right: 5px;
  }
`;

export const HomePage = () => {
  const { data, loading, fetchMore } = useQuery<AllShops, AllShopsVariables>(
    QUERY_SHOPS
  );
  const ref = useRef<HTMLDivElement>(null);
  const isBottomIntersection = useIntersectionObserver(
    ref,
    { threshold: 0 },
    false
  );

  useEffect(() => {
    if (isBottomIntersection && data) {
      const length = data.seeCoffeeShops?.length ?? 0;
      const moreFetch = async (lastId: number) => {
        await fetchMore({
          variables: {
            lastId,
          },
        });
      };
      if (length > 0 && data.seeCoffeeShops) {
        moreFetch(data.seeCoffeeShops[length - 1]?.id!);
      }
    }
  }, [isBottomIntersection, data, fetchMore]);

  return (
    <Container>
      <HelmetOnlyTitle title="Home" />
      {loading && <PageLoader />}
      {!loading &&
        data &&
        data.seeCoffeeShops?.map((shop) => (
          <CafeItem shop={shop!} key={`Shop:${shop?.id}`} />
        ))}
      <div ref={ref} style={{ width: "100%", height: "20px" }} />
    </Container>
  );
};
