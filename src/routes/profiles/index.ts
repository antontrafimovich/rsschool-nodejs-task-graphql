import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createProfileBodySchema, changeProfileBodySchema } from "./schema";
import type { ProfileEntity } from "../../utils/DB/entities/DBProfiles";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<ProfileEntity[]> {
    return fastify.db.profiles.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;

      const result = await fastify.db.profiles.findOne({
        key: "id",
        equals: id,
      });

      if (result === null) {
        return reply
          .code(404)
          .send({ error: `Profile with id ${id} doesn't exist` });
      }

      return result;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      return fastify.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        return await fastify.db.profiles.delete(request.params.id);
      } catch (err) {
        return reply.code(404).send(err);
      }
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profileIdToUpdate = request.params.id;

      try {
        return await fastify.db.profiles.change(
          profileIdToUpdate,
          request.body
        );
      } catch (err) {
        return reply.code(404).send(err);
      }
    }
  );
};

export default plugin;
