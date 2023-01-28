import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import { UserEntity } from "../../../utils/DB/entities/DBUsers";
import { userType } from "./entities/user.type";
import { ResolverContext } from "./model";

export type Mutation = {
  createUser: (args: CreateUserArgs) => UserEntity;
};

export type CreateUserArgs = {
  firstName: string;
  lastName: string;
  email: string;
};

export type CreatePostArgs = {
  title: string;
  content: string;
  userId: string;
};

export const mutationType = new GraphQLObjectType<Mutation, ResolverContext>({
  name: "Mutation",
  fields: () => ({
    createUser: {
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
          description: "Email name of the user",
        },
      },
      resolve: (
        _,
        { firstName, lastName, email }: CreateUserArgs,
        { db: { users } }
      ) => {
        return users.create({ firstName, lastName, email });
      },
    },
    createPost: {
      type: new GraphQLNonNull(userType),
      description: "Creates new user",
      args: {
        title: {
          type: new GraphQLNonNull(GraphQLString),
          description: "Title of the post",
        },
        content: {
          type: new GraphQLNonNull(GraphQLString),
          description: "Content of the post",
        },
        userId: {
          type: new GraphQLNonNull(GraphQLID),
          description: "User id",
        },
      },
      resolve: (_, args: CreatePostArgs, { db: { posts } }) => {
        return posts.create(args);
      },
    },
  }),
});
