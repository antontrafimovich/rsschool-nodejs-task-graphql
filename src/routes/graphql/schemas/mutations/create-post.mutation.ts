import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { postType } from "../entities";
import { ResolverContext } from "../model";

export type CreatePostArgs = {
  title: string;
  content: string;
  userId: string;
};

export const createPost: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(postType),
  description: "Creates new post",
  args: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Title of the post",
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Content of the post",
    },
    userId: {
      type: new GraphQLNonNull(GraphQLID),
      description: "User id",
    },
  },
  resolve: (_, args: CreatePostArgs, { db: { posts } }) => {
    return posts.create(args);
  },
};
