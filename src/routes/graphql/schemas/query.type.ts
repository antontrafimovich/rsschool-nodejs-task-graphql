import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";
import { MemberTypeEntity } from "../../../utils/DB/entities/DBMemberTypes";

import { PostEntity } from "../../../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";
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
      resolve: (_, __, { db: { users } }) => {
        return users.findMany();
      },
    },
    profiles: {
      type: new GraphQLList(profileType),
      description: "List of profiles",
      resolve: (_, __, { db: { profiles } }) => {
        return profiles.findMany();
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
  }),
});
