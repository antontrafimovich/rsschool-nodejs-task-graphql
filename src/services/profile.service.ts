import DataLoader = require("dataloader");

import DB from "../utils/DB/DB";
import { ProfileEntity } from "../utils/DB/entities/DBProfiles";
import { MemberTypeService } from "./member-type.service";
import { UserService } from "./user.service";
import { isError } from "./utils";

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

export const getProfileService = (
  db: DB,
  userService: UserService,
  memberTypeService: MemberTypeService
) => {
  const profilesByIdBatchLoadFn = async (ids: readonly string[]) => {
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

  const profilesByIdsLoader = new DataLoader(profilesByIdBatchLoadFn, {
    cache: false,
  });

  const profilesByUserIdBatchLoadFn = async (userIds: readonly string[]) => {
    const result = await db.profiles.findMany({
      key: "userId",
      equalsAnyOf: userIds as string[],
    });

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

      try {
        await userService.getById(userId);
      } catch (err) {
        throw err;
      }

      const profile = await db.profiles.findOne({
        key: "userId",
        equals: userId,
      });

      if (profile !== null) {
        throw new Error(`User with id ${userId} already has profile.`);
      }

      const { memberTypeId } = entity;

      try {
        await memberTypeService.getById(memberTypeId);
      } catch (err) {
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
