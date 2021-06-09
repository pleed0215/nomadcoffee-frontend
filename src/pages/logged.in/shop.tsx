import { useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router";
import { QUERY_SEE_CAFE } from "../../apollo/queries";
import { SeeCafe, SeeCafeVariables } from "../../codegen/SeeCafe";
import { CafeItem } from "../../components/CafeItem";
import { PageLoader } from "../../components/Loader";
import { AddOrEditPage } from "./add";

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
        <CafeItem shop={data?.seeCoffeeShop!} />
      )}
    </>
  );
};
