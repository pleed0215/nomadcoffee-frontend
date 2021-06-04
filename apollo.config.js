module.exports = {
    client: {
      include: ["/**/*.{tsx,ts}"],
      tagName: "gql",
      service: {
        name: "Nomadcoffee-backend",
        //url: "http://localhost:4000/graphql",
        url: "https://nomadcoffee.herokuapp.com/graphql",
      },
    },
  };