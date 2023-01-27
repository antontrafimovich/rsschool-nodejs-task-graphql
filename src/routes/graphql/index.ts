import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphql } from "graphql/graphql";

import { graphqlBodySchema } from "./schema";
import { schema } from "./schemas";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  const query = (query: string | undefined) => {
    if (query === undefined) {
      return Promise.resolve(null);
    }

    return graphql({
      schema,
      source: query,
      contextValue: { db: fastify.db.users },
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
      const { query: source } = request.body;

      const result = await query(source);

      console.log(`Query result is ${result}`);

      return result;
    }
  );
};

export default plugin;
