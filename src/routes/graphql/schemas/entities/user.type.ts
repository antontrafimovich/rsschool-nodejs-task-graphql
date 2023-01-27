import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { PostEntity } from "../../../../utils/DB/entities/DBPosts";

import { UserEntity } from "../../../../utils/DB/entities/DBUsers";
import { ProfileEntity } from "../../../../utils/DB/entities/DBProfiles";
import { MemberTypeEntity } from "../../../../utils/DB/entities/DBMemberTypes";
import { ResolverContext } from "../model";
import { profileType } from "./profile.type";

type UserType = UserEntity & {
  posts: PostEntity[];
  profile: ProfileEntity;
  memberType: MemberTypeEntity;
};

export const userType: GraphQLObjectType = new GraphQLObjectType<
  UserType,
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
    posts: {
      type: new GraphQLNonNull(profileType),
      resolve: (user: UserEntity, _args, { db: { posts } }) => {
        return posts.findMany({
          key: "userId",
          equals: user.id,
        });
      },
    },
    profile: {
      type: new GraphQLNonNull(profileType),
      resolve: (user: UserEntity, _args, { db: { profiles } }) => {
        return profiles.findOne({
          key: "userId",
          equals: user.id,
        });
      },
    },
    memberType: {
      type: new GraphQLNonNull(profileType),
      resolve: (user: UserType, _args, { db: { memberTypes } }) => {
        return memberTypes.findOne({
          key: "id",
          equals: user.profile.memberTypeId,
        });
      },
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
