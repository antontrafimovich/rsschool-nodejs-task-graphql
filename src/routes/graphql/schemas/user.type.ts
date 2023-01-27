import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import DBUsers, { UserEntity } from "../../../utils/DB/entities/DBUsers";

export const userType: GraphQLObjectType = new GraphQLObjectType({
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
      resolve: async (user: UserEntity, _args, { db }: { db: DBUsers }) => {
        const result = await db.findMany({
          key: "id",
          equalsAnyOf: user.subscribedToUserIds,
        });

        return result;
      },
    },
  }),
});
