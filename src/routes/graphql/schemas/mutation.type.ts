import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

import DBUsers from "../../../utils/DB/entities/DBUsers";
import { userType } from "./user.type";

export const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    createUser: {
      type: new GraphQLNonNull(userType),
      description: "Creates new user",
      args: {
        firstName: {
          type: new GraphQLNonNull(GraphQLString),
          description: "First name of the user",
        },
        lastName: {
          type: new GraphQLNonNull(GraphQLString),
          description: "Last name of the user",
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
          description: "Email name of the user",
        },
      },
      resolve: (
        _,
        {
          firstName,
          lastName,
          email,
        }: { firstName: string; lastName: string; email: string },
        { db }: { db: DBUsers }
      ) => {
        return db.create({ firstName, lastName, email });
      },
    },
  }),
});
