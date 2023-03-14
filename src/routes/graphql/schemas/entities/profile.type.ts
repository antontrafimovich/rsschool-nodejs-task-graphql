import {
  GraphQLFloat,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { ProfileEntity } from "../../../../utils/DB/entities/DBProfiles";
import { ResolverContext } from "../model";
import { memberTypeType } from "./member-type.type";
import { userType } from "./user.type";

export const profileType: GraphQLObjectType = new GraphQLObjectType<
  ProfileEntity,
  ResolverContext
>({
  name: "Profile",
  description: "User's profile",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "The id of the profile",
    },
    avatar: {
      type: GraphQLString,
    },
    sex: {
      type: GraphQLString,
    },
    birthday: {
      type: GraphQLFloat,
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
      resolve: async (profile, _, { services: { memberTypeService } }) => {
        try {
          return await memberTypeService.getById(profile.memberTypeId);
        } catch (err) {
          throw err;
        }
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
