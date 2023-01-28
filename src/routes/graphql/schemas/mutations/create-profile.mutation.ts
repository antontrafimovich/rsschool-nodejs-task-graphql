import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { ProfileEntity } from "../../../../utils/DB/entities/DBProfiles";
import { profileType } from "../entities";
import { ResolverContext } from "../model";
import { sexType } from "../shared";

export type CreateProfileArgs = Omit<ProfileEntity, "id">;

export const createProfile: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(profileType),
  description: "Creates new user profile",
  args: {
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
    memberTypeId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    userId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: (_, args: CreateProfileArgs, { db: { profiles } }) => {
    return profiles.create(args);
  },
};
