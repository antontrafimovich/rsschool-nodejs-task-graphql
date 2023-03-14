import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { MemberTypeEntity } from "../../../../utils/DB/entities/DBMemberTypes";
import { ResolverContext } from "../model";

export const memberTypeType: GraphQLObjectType = new GraphQLObjectType<
  MemberTypeEntity,
  ResolverContext
>({
  name: "MemberType",
  description: "User profile's member type",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The id of the member type",
    },
    discount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    monthPostsLimit: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }),
});
