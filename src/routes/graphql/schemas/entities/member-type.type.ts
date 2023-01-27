import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";

import { MemberTypeEntity } from "../../../../utils/DB/entities/DBMemberTypes";
import { ResolverContext } from "../model";

export const memberTypeType: GraphQLObjectType = new GraphQLObjectType<
  MemberTypeEntity,
  ResolverContext
>({
  name: "MemberType",
  description: "Type of membership in the app",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
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