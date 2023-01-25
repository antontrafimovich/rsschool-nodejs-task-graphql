import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { changeMemberTypeBodySchema } from "./schema";
import type { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return fastify.db.memberTypes.findMany();
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

      const result = await fastify.db.memberTypes.findOne({
        key: "id",
        equals: id,
      });

      if (result === null) {
        return reply
          .code(404)
          .send({ error: `Mmeber type with id ${id} doesn't exist` });
      }

      return result;
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
        return await fastify.db.memberTypes.change(
          memberTypeIdToUpdate,
          request.body
        );
      } catch (err) {
        return reply.code(404).send(err);
      }
    }
  );
};

export default plugin;
