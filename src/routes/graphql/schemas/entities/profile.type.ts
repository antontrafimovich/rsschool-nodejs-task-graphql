import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { ProfileEntity } from "../../../../utils/DB/entities/DBProfiles";
import { ResolverContext } from "../model";
import { sexType } from "../shared/sex.type";
import { memberTypeType } from "./member-type.type";
import { userType } from "./user.type";

export const profileType: GraphQLObjectType = new GraphQLObjectType<
  ProfileEntity,
  ResolverContext
>({
  name: "Profile",
  description: "User's profile of an app",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "The id of the profile",
    },
    avatar: {
      type: GraphQLString,
    },
    sex: {
      type: sexType,
    },
    birthday: {
      type: GraphQLInt,
    },
    country: {
      type: GraphQLString,
    },
    street: {
      type: GraphQLString,
    },
    city: {
      type: GraphQLString,
    },
    memberType: {
      type: memberTypeType,
      resolve: (profile, _, { db: { memberTypes } }) => {
        return memberTypes.findOne({
          key: "id",
          equals: profile.memberTypeId,
        });
      },
    },
    user: {
      type: new GraphQLNonNull(userType),
      resolve: (profile, _, { services: { userService } }) => {
        return userService.getById(profile.userId);
      },
    },
  }),
});
