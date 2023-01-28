import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from "graphql";

import { userType } from "../entities/user.type";
import { ResolverContext } from "../model";

export type CreateUserArgs = {
  firstName: string;
  lastName: string;
  email: string;
};

export const createUser: GraphQLFieldConfig<any, ResolverContext> = {
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
    { firstName, lastName, email }: CreateUserArgs,
    { db: { users } }
  ) => {
    return users.create({ firstName, lastName, email });
  },
};
