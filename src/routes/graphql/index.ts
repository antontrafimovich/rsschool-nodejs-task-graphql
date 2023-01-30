import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { parse, validate } from 'graphql';
import depthLimit = require('graphql-depth-limit');
import { graphql } from 'graphql/graphql';

import { getMemberTypeService, getPostService, getProfileService, getUserService } from '../../services';
import { graphqlBodySchema } from './schema';
import { schema } from './schemas';

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

    const validationResult = validate(schema, parse(query), [depthLimit(3)]);

    if (validationResult.length > 0) {
      return {
        errors: validationResult,
        data: null,
      };
    }

    return graphql({
      schema,
      source: query,
      variableValues: variables,
      contextValue: {
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

      console.log("Anton", request.body);

      const result = await query(source, variables);

      return result;
    }
  );
};

export default plugin;
