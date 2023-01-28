import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphql } from "graphql/graphql";

import { graphqlBodySchema } from "./schema";
import { schema } from "./schemas";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
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
