import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { PostEntity } from "../../../../utils/DB/entities/DBPosts";
import { postType } from "../entities";
import { ResolverContext } from "../model";

export type CreatePostArgs = { input: Omit<PostEntity, "id"> };

const createPostInputType = new GraphQLInputObjectType({
  name: "CreatePostInput",
  fields: {
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
      description: "id of the user",
    },
  },
});

export const createPost: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(postType),
  description: "Creates new post",
  args: {
    input: {
      type: new GraphQLNonNull(createPostInputType),
      description: "Create post DTO",
    },
  },
  resolve: (_, args: CreatePostArgs, { services: { postService } }) => {
    return postService.create(args.input);
  },
};
