import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { UserEntity } from "../../../../utils/DB/entities/DBUsers";
import { ResolverContext } from "../model";
import { memberTypeType } from "./member-type.type";
import { postType } from "./post.type";
import { profileType } from "./profile.type";

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
    posts: {
      type: new GraphQLList(postType),
      resolve: (user: UserEntity, _args, { db: { posts } }) => {
        return posts.findMany({
          key: "userId",
          equals: user.id,
        });
      },
    },
    profile: {
      type: profileType,
      resolve: (user: UserEntity, _args, { db: { profiles } }) => {
        return profiles.findOne({
          key: "userId",
          equals: user.id,
        });
      },
    },
    memberType: {
      type: memberTypeType,
      resolve: async (
        user: UserEntity,
        _args,
        { db: { memberTypes, profiles } }
      ) => {
        const profile = await profiles.findOne({
          key: "userId",
          equals: user.id,
        });

        if (profile === null) {
          throw new Error(
            "Cannot find member type because this user doesn't have a profile"
          );
        }

        return memberTypes.findOne({
          key: "id",
          equals: profile.memberTypeId,
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
