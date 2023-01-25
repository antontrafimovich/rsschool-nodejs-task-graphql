import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    return fastify.db.users.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;

      const result = await fastify.db.users.findOne({
        key: "id",
        equals: id,
      });

      if (result === null) {
        return reply
          .code(404)
          .send({ error: `User with id ${id} doesn't exist` });
      }

      return result;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        return await fastify.db.users.delete(request.params.id);
      } catch (err) {
        return reply.code(404).send(err);
      }
    }
  );

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userIdToSubscribe = request.body.userId;
      const userIdToUpdate = request.params.id;

      const userToUpdate = await fastify.db.users.findOne({
        key: "id",
        equals: userIdToUpdate,
      });

      if (userToUpdate === null) {
        return reply
          .code(404)
          .send({ error: `User with id ${userIdToUpdate} doesn't exist` });
      }

      const newSubscriptions = [
        ...userToUpdate.subscribedToUserIds,
        userIdToSubscribe,
      ];

      return fastify.db.users.change(userIdToUpdate, {
        subscribedToUserIds: newSubscriptions,
      });
    }
  );

  fastify.post(
    "/:id/unsubscribeFrom",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userIdToUnsubscribe = request.body.userId;
      const userIdToUpdate = request.params.id;

      const userToUpdate = await fastify.db.users.findOne({
        key: "id",
        equals: userIdToUpdate,
      });

      if (userToUpdate === null) {
        return reply
          .code(404)
          .send({ error: `User with id ${userIdToUpdate} doesn't exist` });
      }

      const newSubscriptions = userToUpdate.subscribedToUserIds.filter(
        (id) => id !== userIdToUnsubscribe
      );

      return fastify.db.users.change(userIdToUpdate, {
        subscribedToUserIds: newSubscriptions,
      });
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userIdToUpdate = request.params.id;

      const userToUpdate = await fastify.db.users.findOne({
        key: "id",
        equals: userIdToUpdate,
      });

      if (userToUpdate === null) {
        return reply
          .code(404)
          .send({ error: `User with id ${userIdToUpdate} doesn't exist` });
      }

      return fastify.db.users.change(userIdToUpdate, request.body);
    }
  );
};

export default plugin;
