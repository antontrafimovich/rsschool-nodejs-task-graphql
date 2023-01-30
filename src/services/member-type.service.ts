import DataLoader = require("dataloader");

import DB from "../utils/DB/DB";
import { MemberTypeEntity } from "../utils/DB/entities/DBMemberTypes";
import { isError } from "./utils";

export interface MemberTypeService {
  getAll(): Promise<MemberTypeEntity[]>;
  getById(id: string): Promise<MemberTypeEntity>;
  change(
    id: string,
    params: Partial<Omit<MemberTypeEntity, "id">>
  ): Promise<MemberTypeEntity>;
}

export const getMemberTypeService = (db: DB): MemberTypeService => {
  const batchMemberTypeRequests = async (ids: readonly string[]) => {
    const result = await db.memberTypes.findMany({
      key: "id",
      equalsAnyOf: ids as string[],
    });

    return ids.map((id) => {
      const item = result.find((memberType) => memberType.id === id);

      if (item) {
        return item;
      }

      return new Error(`There's no member type with id ${id}`);
    });
  };

  const loader = new DataLoader(batchMemberTypeRequests, { cache: false });

  return {
    getAll: () => {
      return db.memberTypes.findMany();
    },
    getById: async (id: string) => {
      const result = loader.load(id);

      if (isError(result)) {
        throw result;
      }

      return result;
    },
    change: async (
      id: string,
      params: Partial<Omit<MemberTypeEntity, "id">>
    ) => {
      const memberTypeIdToUpdate = id;

      try {
        return await db.memberTypes.change(memberTypeIdToUpdate, params);
      } catch (err) {
        throw err;
      }
    },
  };
};
