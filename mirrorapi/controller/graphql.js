// graphql.js
const { ApolloServer, gql } = require('apollo-server-express');
const { db } = require('../config/db.config');
const express = require('express');

const typeDefs = gql`
  type Country {
    id: ID,
    name: String,
    population:String,
    capital:String,
    timezones:String
  }

  type Query {
    countries: [Country]
  }
`;


const resolvers = {
  Query: {
    countries: async () => {
      try {
        const countriesFromDB = await db.countries.findAll({
          where: {
            flag: 1,
          },
          order: [['name', 'ASC']],
        });

        // Transform the data to match the GraphQL "Country" type
        const countriesForGraphQL = countriesFromDB.map((country) => ({
          id: country.id, // Assuming you have an "id" field in your database
          name: country.name,
          population: country.population, // Map to the corresponding database field
          capital: country.capital, // Map to the corresponding database field
          timezones: country.timezones, // Map to the corresponding database field
          // Add more fields as needed
        }));

        return countriesForGraphQL;
      } catch (err) {
        throw new Error('Internal Server Error');
      }
    },
  },
};
const startApolloServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start(); // Ensure the server is started before applying middleware

  const app = express();
  server.applyMiddleware({ app,path: '/graphql' });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startApolloServer();
