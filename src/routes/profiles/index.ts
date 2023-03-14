import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";

import { idParamSchema } from "../../utils/reusedSchemas";
import { changeProfileBodySchema, createProfileBodySchema } from "./schema";

import type { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import {
  getMemberTypeService,
  getProfileService,
  getUserService,
} from "../../services";
const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  const userService = getUserService(fastify.db);
  const memberTypeService = getMemberTypeService(fastify.db);
  const profileService = getProfileService(
    fastify.db,
    userService,
    memberTypeService
  );

  fastify.get("/", function (request, reply): Promise<ProfileEntity[]> {
    return profileService.getAll();
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

      try {
        return await profileService.getById(id);
      } catch (err) {
        return reply.code(404).send(err);
      }
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
      try {
        return await profileService.create(request.body);
      } catch (err) {
        return reply.code(400).send(err);
      }
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
        return await profileService.change(profileIdToUpdate, request.body);
      } catch (err) {
        return reply.code(400).send(err);
      }
    }
  );
};

export default plugin;
