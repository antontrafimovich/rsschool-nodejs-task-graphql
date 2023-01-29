import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { ProfileEntity } from "../../../../utils/DB/entities/DBProfiles";
import { userType } from "../entities/user.type";
import { ResolverContext } from "../model";
import { sexType } from "../shared";

export type UpdateProfileArgs = {
  id: string;
  params: Partial<Omit<ProfileEntity, "id" | "userId">>;
};

export const updateProfile: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(userType),
  description: "Update profile",
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "id of the profile",
    },
    params: {
      type: new GraphQLInputObjectType({
        name: "UpdateProfileParameters",
        fields: () => ({
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
        }),
      }),
      description: "Profile update params",
    },
  },
  resolve: (_, args: UpdateProfileArgs, { db: { profiles } }) => {
    return profiles.change(args.id, args.params);
  },
};
