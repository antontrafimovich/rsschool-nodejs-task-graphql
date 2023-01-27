import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";

import DBUsers from "../../../utils/DB/entities/DBUsers";
import { userType } from "./user.type";

export const queryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    users: {
      type: new GraphQLList(userType),
      description: "List of users",
      resolve: (_, __, { db }: { db: DBUsers }) => {
        return db.findMany();
      },
    },
    user: {
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: "id of the user",
        },
      },
      resolve: (_source, { id }, { db }: { db: DBUsers }) => {
        return db.findOne({
          key: "id",
          equals: id,
        });
      },
    },
  }),
});
