import DataLoader = require("dataloader");
import DB from "../utils/DB/DB";
import { ProfileEntity } from "../utils/DB/entities/DBProfiles";

export interface ProfileService {
  getAll(): Promise<ProfileEntity[]>;
  getById(id: string): Promise<ProfileEntity>;
  getByUserId(userId: string): Promise<ProfileEntity>;
  create(params: Omit<ProfileEntity, "id">): Promise<ProfileEntity>;
  change(
    id: string,
    params: Partial<Omit<ProfileEntity, "id" | "userId">>
  ): Promise<ProfileEntity>;
}

const isError = (v: unknown): v is Error => {
  return v instanceof Error;
};

export const getProfileService = (
  db: DB
  //   memberTypeService: MemberTypeService
) => {
  const profilesByIdBatchLoadFn = async (ids: readonly string[]) => {
    if (ids.length === 0) {
      return db.profiles.findMany();
    }

    const result = await db.profiles.findMany({
      key: "id",
      equalsAnyOf: ids as string[],
    });

    return ids.map((id) => {
      const item = result.find((profile) => profile.id === id);

      if (item) {
        return item;
      }

      return new Error(`There's no profile with id ${id}`);
    });
  };

  const profilesByIdsLoader = new DataLoader(profilesByIdBatchLoadFn);

  const profilesByUserIdBatchLoadFn = async (userIds: readonly string[]) => {
    const result = await db.profiles.findMany({
      key: "userId",
      equalsAnyOf: userIds as string[],
    });

    console.log("Find many profiles by user ids result", result);

    return userIds.map((userId) => {
      const item = result.find((profile) => profile.userId === userId);

      if (item) {
        return item;
      }

      return new Error(`There's no profile for user with id ${userId}`);
    });
  };

  const profilesByUserIdsLoader = new DataLoader(profilesByUserIdBatchLoadFn, {
    cache: false,
  });

  return {
    getAll: () => {
      return db.profiles.findMany();
    },
    getById: async (id: string) => {
      const result = profilesByIdsLoader.load(id);

      if (isError(result)) {
        throw result;
      }

      return result;
    },
    getByUserId: async (userId: string) => {
      const result = profilesByUserIdsLoader.load(userId);

      if (isError(result)) {
        throw result;
      }

      return result;
    },
    create: async (entity: Omit<ProfileEntity, "id">) => {
      const { userId } = entity;

      const user = await db.users.findOne({
        key: "id",
        equals: userId,
      });

      if (user === null) {
        throw new Error(`User with id ${userId} doesn't exist.`);
      }

      const profile = await db.profiles.findOne({
        key: "userId",
        equals: userId,
      });

      if (profile !== null) {
        throw new Error(`User with id ${userId} already has profile.`);
      }

      const { memberTypeId } = entity;

      const memberType = await db.memberTypes.findOne({
        key: "id",
        equals: memberTypeId,
      });

      if (memberType === null) {
        throw new Error(`Member type with id ${memberTypeId} doesn't exist.`);
      }

      return db.profiles.create(entity);
    },
    change: async (
      id: string,
      entity: Partial<Omit<ProfileEntity, "id" | "userId">>
    ) => {
      const profileIdToUpdate = id;

      try {
        return await db.profiles.change(profileIdToUpdate, entity);
      } catch (err) {
        throw err;
      }
    },
  };
};
