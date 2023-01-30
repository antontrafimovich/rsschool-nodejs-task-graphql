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
      resolve: async (
        user: UserEntity,
        _args,
        { services: { profileService } }
      ) => {
        try {
          return await profileService.getByUserId(user.id);
        } catch (err) {
          console.error(err);
          return null;
        }
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
          return null;
        }

        return memberTypes.findOne({
          key: "id",
          equals: profile.memberTypeId,
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (
        user: UserEntity,
        _args,
        { services: { userService }    }
      ) => {
        const result = await userService.getSubscribedToUser(user.id);

        return result;
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (
        user: UserEntity,
        _args,
        { services: { userService } }
      ) => {
        const result = await userService.getByIds(user.subscribedToUserIds);

        return result;
      },
    },
  }),
});
