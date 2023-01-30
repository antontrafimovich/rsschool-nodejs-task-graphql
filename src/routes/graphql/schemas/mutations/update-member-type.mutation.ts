import {
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { MemberTypeEntity } from "../../../../utils/DB/entities/DBMemberTypes";
import { memberTypeType } from "../entities";
import { ResolverContext } from "../model";

export type UpdateMemberTypeArgs = {
  id: string;
  params: Partial<Omit<MemberTypeEntity, "id">>;
};

const updateMemberTypeType = new GraphQLInputObjectType({
  name: "UpdateMemberTypeInput",
  fields: () => ({
    discount: {
      type: GraphQLInt,
      description: "Some discount",
    },
    monthPostsLimit: {
      type: GraphQLInt,
      description: "Limit of posts to be created during month.",
    },
  }),
});

export const updateMemberType: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(memberTypeType),
  description: "Update member type",
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "id of the member type",
    },
    params: {
      type: new GraphQLNonNull(updateMemberTypeType),
      description: "Update member type DTO",
    },
  },
  resolve: (
    _,
    args: UpdateMemberTypeArgs,
    { services: { memberTypeService } }
  ) => {
    return memberTypeService.change(args.id, args.params);
  },
};
