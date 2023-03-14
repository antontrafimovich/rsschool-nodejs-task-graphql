import { GraphQLSchema } from "graphql";
import { mutationType } from "./mutation.type";
import { queryType } from "./query.type";
import { userType } from "./entities/user.type";
import { memberTypeType } from "./entities/member-type.type";
import { profileType } from "./entities/profile.type";
import { postType } from "./entities/post.type";

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
  types: [userType, memberTypeType, profileType, postType],
});
