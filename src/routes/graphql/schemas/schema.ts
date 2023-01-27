import { GraphQLSchema } from "graphql";
import { mutationType } from "./mutation.type";
import { queryType } from "./query.type";
import { userType } from "./user.type";

export const schema: GraphQLSchema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
  types: [userType],
});
