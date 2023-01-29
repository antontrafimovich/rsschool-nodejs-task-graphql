import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
} from "graphql";

import { MemberTypeEntity } from "../../../../utils/DB/entities/DBMemberTypes";
import { userType } from "../entities/user.type";
import { ResolverContext } from "../model";

export type UpdateMemberTypeArgs = {
  id: string;
  params: Partial<Omit<MemberTypeEntity, "id">>;
};

export const updateMemberType: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(userType),
  description: "Update member type",
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "id of the member type",
    },
    params: {
      type: new GraphQLInputObjectType({
        name: "UpdateMemberTypeParameters",
        fields: () => ({
          discount: {
            type: GraphQLInt,
          },
          monthPostsLimit: {
            type: GraphQLInt,
          },
        }),
      }),
      description: "Member type update params",
    },
  },
  resolve: (_, args: UpdateMemberTypeArgs, { db: { memberTypes } }) => {
    return memberTypes.change(args.id, args.params);
  },
};
