import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { UserEntity } from "../../../../utils/DB/entities/DBUsers";
import { userType } from "../entities/user.type";
import { ResolverContext } from "../model";

export type UpdateUserArgs = {
  id: string;
  params: Partial<Omit<UserEntity, "id">>;
};

const updateUserInputType = new GraphQLInputObjectType({
  name: "UpdateUserInput",
  fields: () => ({
    firstName: {
      type: GraphQLString,
      description: "First name of the user",
    },
    lastName: {
      type: GraphQLString,
      description: "Last name of the user",
    },
    email: {
      type: GraphQLString,
      description: "Email of the user",
    },
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLID),
      description: "User's subscriptions list",
    },
  }),
});

export const updateUser: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(userType),
  description: "Update user",
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "id of the user",
    },
    params: {
      type: new GraphQLNonNull(updateUserInputType),
      description: "User update DTO",
    },
  },
  resolve: (_, args: UpdateUserArgs, { services: { userService } }) => {
    return userService.change(args.id, args.params);
  },
};
