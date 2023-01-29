import { GraphQLObjectType } from "graphql";

import { ResolverContext } from "./model";
import {
  createPost,
  createProfile,
  createUser,
  subscribeToUser,
  updateMemberType,
  updatePost,
  updateProfile,
  updateUser,
} from "./mutations";

export const mutationType = new GraphQLObjectType<any, ResolverContext>({
  name: "Mutation",
  fields: () => ({
    createUser,
    createPost,
    createProfile,
    updateUser,
    updatePost,
    updateProfile,
    updateMemberType,
    subscribeToUser,
  }),
});
