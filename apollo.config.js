module.exports = {
  client: {
    include: ["/**/*.{tsx,ts}"],
    tagName: "gql",
    service: {
      name: "Nomadcoffee-backend",
      //url: "http://localhost:4000/graphql",
      url: "http://54.180.108.2/graphql",
    },
  },
};
