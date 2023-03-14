import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { ProfileEntity } from "../../../../utils/DB/entities/DBProfiles";
import { profileType } from "../entities";
import { ResolverContext } from "../model";

export type UpdateProfileArgs = {
  id: string;
  params: Partial<Omit<ProfileEntity, "id" | "userId">>;
};

const updateProfileInputType = new GraphQLInputObjectType({
  name: "UpdateProfileInput",
  fields: () => ({
    avatar: {
      type: GraphQLString,
    },
    sex: {
      type: GraphQLString,
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
      type: GraphQLID,
    },
  }),
});

export const updateProfile: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(profileType),
  description: "Update profile",
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "id of the profile",
    },
    params: {
      type: new GraphQLNonNull(updateProfileInputType),
      description: "Update profile DTO",
    },
  },
  resolve: (_, args: UpdateProfileArgs, { services: { profileService } }) => {
    return profileService.change(args.id, args.params);
  },
};
