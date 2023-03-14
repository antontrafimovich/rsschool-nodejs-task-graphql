import {
  GraphQLFieldConfig,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { ProfileEntity } from "../../../../utils/DB/entities/DBProfiles";
import { profileType } from "../entities";
import { ResolverContext } from "../model";

export type CreateProfileArgs = { input: Omit<ProfileEntity, "id"> };

const createProfileInputType = new GraphQLInputObjectType({
  name: "CreateProfileInput",
  fields: {
    avatar: {
      type: new GraphQLNonNull(GraphQLString),
    },
    sex: {
      type: new GraphQLNonNull(GraphQLString),
    },
    birthday: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    country: {
      type: new GraphQLNonNull(GraphQLString),
    },
    street: {
      type: new GraphQLNonNull(GraphQLString),
    },
    city: {
      type: new GraphQLNonNull(GraphQLString),
    },
    memberTypeId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    userId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
});

export const createProfile: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(profileType),
  description: "Creates new user profile",
  args: {
    input: {
      type: new GraphQLNonNull(createProfileInputType),
      description: "Create profile DTO",
    },
  },
  resolve: (_, args: CreateProfileArgs, { services: { profileService } }) => {
    return profileService.create(args.input);
  },
};
