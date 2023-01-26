import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

import { idParamSchema } from '../../utils/reusedSchemas';
import { changePostBodySchema, createPostBodySchema } from './schema';

import type { PostEntity } from "../../utils/DB/entities/DBPosts";
const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<PostEntity[]> {
    return fastify.db.posts.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { id } = request.params;

      const result = await fastify.db.posts.findOne({
        key: "id",
        equals: id,
      });

      if (result === null) {
        return reply
          .code(404)
          .send({ error: `Post with id ${id} doesn't exist` });
      }

      return result;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      return fastify.db.posts.create(request.body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { id } = request.params;

      try {
        return await fastify.db.posts.delete(id);
      } catch (err) {
        return reply.code(400).send(err);
      }
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { id: postIdToUpdate } = request.params;

      try {
        return await fastify.db.posts.change(postIdToUpdate, request.body);
      } catch (err) {
        return reply.code(400).send(err);
      }
    }
  );
};

export default plugin;
