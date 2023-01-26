import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

import { idParamSchema } from '../../utils/reusedSchemas';
import { changeProfileBodySchema, createProfileBodySchema } from './schema';

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
      const { userId } = request.body;

      const user = await fastify.db.users.findOne({
        key: "id",
        equals: userId,
      });

      if (user === null) {
        return reply
          .code(400)
          .send(new Error(`User with id ${userId} doesn't exist.`));
      }

      const profile = await fastify.db.profiles.findOne({
        key: "userId",
        equals: userId,
      });

      if (profile !== null) {
        return reply
          .code(400)
          .send(new Error(`User with id ${userId} already has profile.`));
      }

      const { memberTypeId } = request.body;

      const memberType = await fastify.db.memberTypes.findOne({
        key: "id",
        equals: memberTypeId,
      });

      if (memberType === null) {
        return reply
          .code(400)
          .send(
            new Error(`Member type with id ${memberTypeId} doesn't exist.`)
          );
      }

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
      const { id } = request.params;

      try {
        return await fastify.db.profiles.delete(id);
      } catch (err) {
        return reply.code(400).send(err);
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
      const { id: profileIdToUpdate } = request.params;

      try {
        return await fastify.db.profiles.change(
          profileIdToUpdate,
          request.body
        );
      } catch (err) {
        return reply.code(400).send(err);
      }
    }
  );
};

export default plugin;
