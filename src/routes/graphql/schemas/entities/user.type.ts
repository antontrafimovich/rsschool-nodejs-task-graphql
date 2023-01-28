import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import { MemberTypeEntity } from '../../../../utils/DB/entities/DBMemberTypes';
import { PostEntity } from '../../../../utils/DB/entities/DBPosts';
import { ProfileEntity } from '../../../../utils/DB/entities/DBProfiles';
import { UserEntity } from '../../../../utils/DB/entities/DBUsers';
import { ResolverContext } from '../model';
import { memberTypeType } from './member-type.type';
import { postType } from './post.type';
import { profileType } from './profile.type';

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
