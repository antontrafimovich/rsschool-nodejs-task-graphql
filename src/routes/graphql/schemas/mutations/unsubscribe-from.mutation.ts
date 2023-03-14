import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from "graphql";

import { userType } from "../entities/user.type";
import { ResolverContext } from "../model";

export type UnsubscribeFromUserArgs = {
  input: {
    userId: string;
    userToUnsubscribeId: string;
  };
};

const unsubscribeFromUserInputType = new GraphQLInputObjectType({
  name: "UnsubscribeFromUserInput",
  fields: () => ({
    userId: {
      type: new GraphQLNonNull(GraphQLID),
      description: "id of the user",
    },
    userToUnsubscribeId: {
      type: new GraphQLNonNull(GraphQLID),
      description: "id of user to unsubscribe",
    },
  }),
});

export const unsubscribeFromUser: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(userType),
  description: "Unsubscribe from user",
  args: {
    input: {
      type: new GraphQLNonNull(unsubscribeFromUserInputType),
      description: "Unsubscribe from user input DTO",
    },
  },
  resolve: (
    _,
    args: UnsubscribeFromUserArgs,
    { services: { userService } }
  ) => {
    return userService.unsubscribe(
      args.input.userId,
      args.input.userToUnsubscribeId
    );
  },
};
