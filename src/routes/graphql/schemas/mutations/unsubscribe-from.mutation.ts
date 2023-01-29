import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";

import { userType } from "../entities/user.type";
import { ResolverContext } from "../model";

export type UnsubscribeFromArgs = {
  userId: string;
  userToUnsubscribeId: string;
};

export const unsubscribeFromUser: GraphQLFieldConfig<any, ResolverContext> = {
  type: new GraphQLNonNull(userType),
  description: "Unsubscribe from user",
  args: {
    userId: {
      type: new GraphQLNonNull(GraphQLID),
      description: "id of the user",
    },
    userToUnubscribeId: {
      type: new GraphQLNonNull(GraphQLID),
      description: "User id to unsubscribe",
    },
  },
  resolve: (_, args: UnsubscribeFromArgs, { services: { userService } }) => {
    return userService.subscribe(args.userId, args.userToUnsubscribeId);
  },
};
