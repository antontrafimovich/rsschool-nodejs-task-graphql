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

export type UpdatePostArgs = {
  id: string;
  params: Partial<Omit<PostEntity, "id" | "userId">>;
};

const updatePostInputType = new GraphQLInputObjectType({
  name: "UpdatePostInput",
  fields: () => ({
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
  }),
});

export const updatePost: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(postType),
  description: "Update post",
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "id of the post",
    },
    params: {
      type: new GraphQLNonNull(updatePostInputType),
      description: "Update post DTO",
    },
  },
  resolve: (_, args: UpdatePostArgs, { services: { postService } }) => {
    return postService.change(args.id, args.params);
  },
};
