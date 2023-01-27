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
      description: "The id of the user",
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    user: {
      type: userType,
      resolve: (post, _, { db: { users } }) => {
        return users.findOne({
          key: "id",
          equals: post.userId,
        });
      },
    },
  }),
});
