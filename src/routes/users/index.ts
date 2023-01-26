import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";

import { idParamSchema } from "../../utils/reusedSchemas";
import {
  changeUserBodySchema,
  createUserBodySchema,
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
          .send(new Error(`User with id ${id} doesn't exist`));
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
      const { id } = request.params;

      let deletedUser: UserEntity;
      try {
        deletedUser = await fastify.db.users.delete(id);
      } catch (err) {
        return reply.code(400).send(err);
      }

      const subscribers = await fastify.db.users.findMany({
        key: "subscribedToUserIds",
        inArray: id,
      });

      const usersWithUpdatedSubscriptions = subscribers.map((s) => {
        return {
          ...s,
          subscribedToUserIds: s.subscribedToUserIds.filter(
            (subscriptionId) => subscriptionId !== id
          ),
        };
      });

      try {
        await Promise.all(
          usersWithUpdatedSubscriptions.map((user) =>
            fastify.db.users.change(user.id, {
              subscribedToUserIds: user.subscribedToUserIds,
            })
          )
        );
      } catch (err) {
        return reply.status(500).send(err);
      }

      const posts = await fastify.db.posts.findMany({
        key: "userId",
        equals: id,
      });

      if (posts.length > 0) {
        try {
          await Promise.all(
            posts.map((post) => fastify.db.posts.delete(post.id))
          );
        } catch (err) {
          return reply.code(500).send(err);
        }
      }

      const profile = await fastify.db.profiles.findOne({
        key: "userId",
        equals: id,
      });

      if (profile !== null) {
        try {
          await fastify.db.profiles.delete(profile.id);
        } catch (err) {
          return reply.code(500).send(err);
        }
      }

      return deletedUser;
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
      const userIdToSubscribe = request.params.id;
      const userIdToUpdate = request.body.userId;

      const userToSubscribe = await fastify.db.users.findOne({
        key: "id",
        equals: userIdToSubscribe,
      });

      if (userToSubscribe === null) {
        return reply
          .code(400)
          .send(new Error(`User with id ${userIdToSubscribe} doesn't exist`));
      }

      const userToUpdate = await fastify.db.users.findOne({
        key: "id",
        equals: userIdToUpdate,
      });

      if (userToUpdate === null) {
        return reply
          .code(400)
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
      const userIdToUnsubscribe = request.params.id;
      const userIdToUpdate = request.body.userId;

      const userToUnsubscribe = await fastify.db.users.findOne({
        key: "id",
        equals: userIdToUpdate,
      });

      if (userToUnsubscribe === null) {
        return reply
          .code(400)
          .send({ error: `User with id ${userIdToUnsubscribe} doesn't exist` });
      }

      const userToUpdate = await fastify.db.users.findOne({
        key: "id",
        equals: userIdToUpdate,
      });

      if (userToUpdate === null) {
        return reply
          .code(400)
          .send({ error: `User with id ${userIdToUpdate} doesn't exist` });
      }

      const isSubscribed =
        userToUpdate.subscribedToUserIds.includes(userIdToUnsubscribe);

      if (!isSubscribed) {
        return reply
          .code(400)
          .send(
            `User with id ${userIdToUpdate} is not subscribed to user with id ${userIdToUnsubscribe}`
          );
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

      try {
        return await fastify.db.users.change(userIdToUpdate, request.body);
      } catch (err) {
        return reply.code(400).send(err);
      }
    }
  );
};

export default plugin;
