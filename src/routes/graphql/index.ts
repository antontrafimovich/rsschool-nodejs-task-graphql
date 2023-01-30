import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphql } from "graphql/graphql";

import {
  getMemberTypeService,
  getPostService,
  getProfileService,
  getUserService,
} from "../../services";
import { graphqlBodySchema } from "./schema";
import { schema } from "./schemas";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  const userService = getUserService(fastify.db);
  const memberTypeService = getMemberTypeService(fastify.db);
  const postService = getPostService(fastify.db);
  const profileService = getProfileService(
    fastify.db,
    userService,
    memberTypeService
  );

  const query = (
    query: string | undefined,
    variables:
      | {
          [variable: string]: unknown;
        }
      | undefined
  ) => {
    if (query === undefined) {
      return Promise.resolve(null);
    }

    return graphql({
      schema,
      source: query,
      variableValues: variables,
      contextValue: {
        db: fastify.db,
        services: {
          userService,
          profileService,
          memberTypeService,
          postService,
        },
      },
    });
  };

  fastify.post(
    "/",
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const { query: source, variables } = request.body;

      const result = await query(source, variables);

      return result;
    }
  );
};

export default plugin;
