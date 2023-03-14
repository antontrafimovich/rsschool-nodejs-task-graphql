import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from "graphql";

import { userType } from "../entities/user.type";
import { ResolverContext } from "../model";

export type SubscribeToArgs = {
  input: {
    userId: string;
    userToSubscribeId: string;
  };
};

const subscribeFromUserInputType = new GraphQLInputObjectType({
  name: "SubscribeToUserInput",
  fields: () => ({
    userId: {
      type: new GraphQLNonNull(GraphQLID),
      description: "id of the user",
    },
    userToSubscribeId: {
      type: new GraphQLNonNull(GraphQLID),
      description: "User id to subscribe",
    },
  }),
});

export const subscribeToUser: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(userType),
  description: "Subscribe to user",
  args: {
    input: {
      type: new GraphQLNonNull(subscribeFromUserInputType),
      description: "Subscribe to user input DTO",
    },
  },
  resolve: (_, args: SubscribeToArgs, { services: { userService } }) => {
    return userService.subscribe(
      args.input.userId,
      args.input.userToSubscribeId
    );
  },
};
