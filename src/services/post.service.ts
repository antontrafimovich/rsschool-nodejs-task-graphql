import DataLoader = require("dataloader");

import DB from "../utils/DB/DB";
import { PostEntity } from "../utils/DB/entities/DBPosts";
import { isError } from "./utils";

export interface PostService {
  getAll(): Promise<PostEntity[]>;
  getById(id: string): Promise<PostEntity>;
  getByUserId(userId: string): Promise<PostEntity>;
  create(params: Omit<PostEntity, "id">): Promise<PostEntity>;
  change(
    id: string,
    params: Partial<Omit<PostEntity, "id" | "userId">>
  ): Promise<PostEntity>;
}

export const getPostService = (db: DB) => {
  const postsByIdBatchLoadFn = async (ids: readonly string[]) => {
    const result = await db.posts.findMany({
      key: "id",
      equalsAnyOf: ids as string[],
    });

    return ids.map((id) => {
      const item = result.find((post) => post.id === id);

      if (item) {
        return item;
      }

      return new Error(`There's no post with id ${id}`);
    });
  };

  const postsByIdLoader = new DataLoader(postsByIdBatchLoadFn, {
    cache: false,
  });

  const postsByUserIdBatchLoadFn = async (userIds: readonly string[]) => {
    const result = await db.posts.findMany({
      key: "userId",
      equalsAnyOf: userIds as string[],
    });

    return userIds.map((userId) => {
      const posts = result.filter((post) => post.userId === userId);

      if (posts.length) {
        return posts;
      }

      return new Error(`There're no posts for user with id ${userId}`);
    });
  };

  const postsByUserIdsLoader = new DataLoader(postsByUserIdBatchLoadFn, {
    cache: false,
  });

  return {
    getAll: () => {
      return db.posts.findMany();
    },
    getById: async (id: string) => {
      const result = postsByIdLoader.load(id);

      if (isError(result)) {
        throw result;
      }

      return result;
    },
    getByUserId: async (userId: string) => {
      const result = postsByUserIdsLoader.load(userId);

      if (isError(result)) {
        throw result;
      }

      return result;
    },
    create: async (entity: Omit<PostEntity, "id">) => {
      return db.posts.create(entity);
    },
    change: async (
      id: string,
      entity: Partial<Omit<PostEntity, "id" | "userId">>
    ) => {
      const postIdToUpdate = id;

      try {
        return await db.posts.change(postIdToUpdate, entity);
      } catch (err) {
        throw err;
      }
    },
  };
};
