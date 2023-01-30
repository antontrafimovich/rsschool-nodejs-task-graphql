import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from "graphql";

import { UserEntity } from "../../../../utils/DB/entities/DBUsers";
import { userType } from "../entities/user.type";
import { ResolverContext } from "../model";

export type CreateUserArgs = Omit<UserEntity, "id" | "subscribedToUserIds">;

export const createUser: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(userType),
  description: "Creates new user",
  args: {
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
      description: "First name of the user",
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Last name of the user",
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Email of the user",
    },
  },
  resolve: (_, args: CreateUserArgs, { services: { userService } }) => {
    return userService.create(args);
  },
};
