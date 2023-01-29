import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";

import { userType } from "../entities/user.type";
import { ResolverContext } from "../model";

export type SubscribeToArgs = {
  userId: string;
  userToSubscribeId: string;
};

export const subscribeToUser: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(userType),
  description: "Subscribe to user",
  args: {
    userId: {
      type: new GraphQLNonNull(GraphQLID),
      description: "id of the user",
    },
    userToSubscribeId: {
      type: new GraphQLNonNull(GraphQLID),
      description: "User id to subscribe",
    },
  },
  resolve: (_, args: SubscribeToArgs, { services: { userService } }) => {
    return userService.subscribe(args.userId, args.userToSubscribeId);
  },
};
