import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { MemberTypeEntity } from "../../../utils/DB/entities/DBMemberTypes";
import { PostEntity } from "../../../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";
import { memberTypeType } from "./entities/member-type.type";
import { postType } from "./entities/post.type";
import { profileType } from "./entities/profile.type";
import { userType } from "./entities/user.type";
import { ResolverContext } from "./model";

export type Query = {
  users: UserEntity[];
  posts: PostEntity[];
  profiles: ProfileEntity[];
  memberTypes: MemberTypeEntity[];
  user: UserEntity;
};

export const queryType = new GraphQLObjectType<Query, ResolverContext>({
  name: "Query",
  fields: () => ({
    users: {
      type: new GraphQLList(userType),
      description: "List of users",
      resolve: (_, __, { services: { userService } }) => {
        return userService.getAll();
      },
    },
    profiles: {
      type: new GraphQLList(profileType),
      description: "List of profiles",
      resolve: (_, __, { services: { profileService } }) => {
        return profileService.getAll();
      },
    },
    posts: {
      type: new GraphQLList(postType),
      description: "List of posts",
      resolve: (_, __, { db: { posts } }) => {
        return posts.findMany();
      },
    },
    memberTypes: {
      type: new GraphQLList(postType),
      description: "List of member types",
      resolve: (_, __, { db: { memberTypes } }) => {
        return memberTypes.findMany();
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
      resolve: (_source, { id }, { db: { users } }) => {
        return users.findOne({
          key: "id",
          equals: id,
        });
      },
    },
    post: {
      type: postType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: "id of the post",
        },
      },
      resolve: (_source, { id }, { db: { posts } }) => {
        return posts.findOne({
          key: "id",
          equals: id,
        });
      },
    },
    profile: {
      type: profileType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: "id of the profile",
        },
      },
      resolve: (_source, { id }, { db: { profiles } }) => {
        return profiles.findOne({
          key: "id",
          equals: id,
        });
      },
    },
    memberType: {
      type: memberTypeType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
          description: "id of the member type",
        },
      },
      resolve: (_source, { id }, { db: { memberTypes } }) => {
        return memberTypes.findOne({
          key: "id",
          equals: id,
        });
      },
    },
  }),
});
