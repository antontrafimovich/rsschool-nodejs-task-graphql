import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";

import { idParamSchema } from "../../utils/reusedSchemas";
import { changePostBodySchema, createPostBodySchema } from "./schema";

import type { PostEntity } from "../../utils/DB/entities/DBPosts";
import { getPostService } from "../../services";
const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  const postService = getPostService(fastify.db);

  fastify.get("/", async function (request, reply): Promise<PostEntity[]> {
    return postService.getAll();
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

      try {
        return await postService.getById(id);
      } catch (err) {
        return reply.code(404).send(err);
      }
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    function (request, reply): Promise<PostEntity> {
      return postService.create(request.body);
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
        return await postService.change(postIdToUpdate, request.body);
      } catch (err) {
        return reply.code(400).send(err);
      }
    }
  );
};

export default plugin;
