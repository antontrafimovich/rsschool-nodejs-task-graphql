import {
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import { UserEntity } from "../../../../utils/DB/entities/DBUsers";
import { userType } from "../entities/user.type";
import { ResolverContext } from "../model";

export type CreateUserArgs = {
  input: Omit<UserEntity, "id" | "subscribedToUserIds">;
};

const createUserInputType = new GraphQLInputObjectType({
  name: "CreateUserInput",
  fields: {
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
});

export const createUser: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(userType),
  description: "Creates new user",
  args: {
    input: {
      type: new GraphQLNonNull(createUserInputType),
      description: "Create user DTO",
    },
  },
  resolve: (_, args: CreateUserArgs, { services: { userService } }) => {
    return userService.create(args.input);
  },
};
