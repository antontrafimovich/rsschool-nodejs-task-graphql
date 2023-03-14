import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { PostEntity } from "../../../../utils/DB/entities/DBPosts";
import { ResolverContext } from "../model";
import { userType } from "./user.type";

export const postType: GraphQLObjectType = new GraphQLObjectType<
  PostEntity,
  ResolverContext
>({
  name: "Post",
  description: "User's post",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "The id of the post",
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    user: {
      type: new GraphQLNonNull(userType),
      resolve: async (post, _, { services: { userService } }) => {
        try {
          return await userService.getById(post.userId);
        } catch (err) {
          throw err;
        }
      },
    },
  }),
});
