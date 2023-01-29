import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";

import { idParamSchema } from "../../utils/reusedSchemas";
import {
  changeUserBodySchema,
  createUserBodySchema,
  subscribeBodySchema,
} from "./schemas";

import type { UserEntity } from "../../utils/DB/entities/DBUsers";
import { getUserService } from "../../services";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  const userService = getUserService(fastify.db);

  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    return userService.getAll();
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

      try {
        return await userService.getById(id);
      } catch (err) {
        return reply.code(404).send(err);
      }
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
      return userService.create(request.body);
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

      try {
        return await userService.subscribe(userIdToUpdate, userIdToSubscribe);
      } catch (err) {
        return reply.code(400).send(err);
      }
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

      try {
        return await userService.unsubscribe(
          userIdToUpdate,
          userIdToUnsubscribe
        );
      } catch (err) {
        return reply.code(400).send(err);
      }
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
        return await userService.change(userIdToUpdate, request.body);
      } catch (err) {
        return reply.code(400).send(err);
      }
    }
  );
};

export default plugin;
