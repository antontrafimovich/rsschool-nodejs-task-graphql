import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { PostEntity } from "../../../../utils/DB/entities/DBPosts";
import { userType } from "../entities/user.type";
import { ResolverContext } from "../model";

export type UpdatePostArgs = {
  id: string;
  params: Partial<Omit<PostEntity, "id" | "userId">>;
};

export const updatePost: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(userType),
  description: "Update post",
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "id of the post",
    },
    params: {
      type: new GraphQLInputObjectType({
        name: "UpdatePostParameters",
        fields: () => ({
          title: {
            type: GraphQLString,
          },
          content: {
            type: GraphQLString,
          },
        }),
      }),
      description: "Post update params",
    },
  },
  resolve: (_, args: UpdatePostArgs, { db: { posts } }) => {
    return posts.change(args.id, args.params);
  },
};
