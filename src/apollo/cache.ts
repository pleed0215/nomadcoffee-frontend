import {
  FieldFunctionOptions,
  FieldPolicy,
  InMemoryCache,
} from "@apollo/client";
import { AllShop } from "../codegen/AllShop";

// exisiting이 계속 undefined로 되는 이유..?
// 참고: https://github.com/apollographql/apollo-client/issues/6729
const seeCoffeeShopsFieldPolicy: FieldPolicy<AllShop[], AllShop[]> = {
  keyArgs: false,
  merge: (existing, incoming, options: FieldFunctionOptions) => {
    if (options.args?.hasOwnProperty("lastId") && options.args?.lastId !== 0) {
      const safePrev = existing ? existing.slice(0) : [];
      return [...safePrev, ...incoming];
    } else {
      return [...incoming];
    }
  },
};

export const apolloCache = new InMemoryCache({
  typePolicies: {
    Category: {
      keyFields: (obj) => `Category:${obj.slug}`,
    },
    Query: {
      fields: {
        seeCoffeeShops: seeCoffeeShopsFieldPolicy,
      },
    },
  },
});
