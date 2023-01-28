import { GraphQLObjectType } from "graphql";

import { ResolverContext } from "./model";
import { createPost, createProfile, createUser } from "./mutations";

export const mutationType = new GraphQLObjectType<any, ResolverContext>({
  name: "Mutation",
  fields: () => ({
    createUser,
    createPost,
    createProfile,
  }),
});
