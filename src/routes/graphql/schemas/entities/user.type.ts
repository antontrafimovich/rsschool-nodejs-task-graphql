import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { UserEntity } from "../../../../utils/DB/entities/DBUsers";
import { ResolverContext } from "../model";

export const userType: GraphQLObjectType = new GraphQLObjectType<
  UserEntity,
  ResolverContext
>({
  name: "User",
  description: "User of an app",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "The id of the user",
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    subscribedToUsers: {
      type: new GraphQLNonNull(userType),
      resolve: async (user: UserEntity, _args, { db: { users } }) => {
        const result = await users.findMany({
          key: "id",
          equalsAnyOf: user.subscribedToUserIds,
        });

        return result;
      },
    },
  }),
});
