import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";

import { getMemberTypeService } from "../../services";
import { idParamSchema } from "../../utils/reusedSchemas";
import { changeMemberTypeBodySchema } from "./schema";

import type { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";
const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  const memberTypeService = getMemberTypeService(fastify.db);

  fastify.get("/", async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return memberTypeService.getAll();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const { id } = request.params;

      try {
        return await memberTypeService.getById(id);
      } catch (err) {
        return reply.code(404).send(err);
      }
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const memberTypeIdToUpdate = request.params.id;

      try {
        return await memberTypeService.change(
          memberTypeIdToUpdate,
          request.body
        );
      } catch (err) {
        return reply.code(400).send(err);
      }
    }
  );
};

export default plugin;
