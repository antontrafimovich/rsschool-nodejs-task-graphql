import DB from "../utils/DB/DB";
import { UserEntity } from "../utils/DB/entities/DBUsers";

export interface UserService {
  getAll(): Promise<UserEntity[]>;
  getById(id: string): Promise<UserEntity>;
  create(
    params: Omit<UserEntity, "id" | "subscribedToUserIds">
  ): Promise<UserEntity>;
  subscribe(userId: string, userIdToSubscribe: string): Promise<UserEntity>;
  unsubscribe(userId: string, userIdToUnsubscribe: string): Promise<UserEntity>;
  change(
    id: string,
    params: Partial<Omit<UserEntity, "id">>
  ): Promise<UserEntity>;
}

export const getUserService = (db: DB): UserService => {
  return {
    getAll: () => {
      return db.users.findMany();
    },
    getById: async (id: string) => {
      const result = await db.users.findOne({
        key: "id",
        equals: id,
      });

      if (result === null) {
        throw new Error(`Post with id ${id} doesn't exist`);
      }

      return result;
    },
    create: (params: Omit<UserEntity, "id" | "subscribedToUserIds">) => {
      return db.users.create(params);
    },
    subscribe: async (userId: string, userIdToSubscribe: string) => {
      const userIdToUpdate = userId;

      const userToSubscribe = await db.users.findOne({
        key: "id",
        equals: userIdToSubscribe,
      });

      if (userToSubscribe === null) {
        throw new Error(`User with id ${userIdToSubscribe} doesn't exist`);
      }

      const userToUpdate = await db.users.findOne({
        key: "id",
        equals: userIdToUpdate,
      });

      if (userToUpdate === null) {
        throw new Error(`User with id ${userIdToUpdate} doesn't exist`);
      }

      const newSubscriptions = [
        ...userToUpdate.subscribedToUserIds,
        userIdToSubscribe,
      ];

      return db.users.change(userIdToUpdate, {
        subscribedToUserIds: newSubscriptions,
      });
    },
    unsubscribe: async (userId: string, userIdToUnsubscribe: string) => {
      const userIdToUpdate = userId;

      const userToUnsubscribe = await db.users.findOne({
        key: "id",
        equals: userIdToUpdate,
      });

      if (userToUnsubscribe === null) {
        throw new Error(`User with id ${userIdToUnsubscribe} doesn't exist`);
      }

      const userToUpdate = await db.users.findOne({
        key: "id",
        equals: userIdToUpdate,
      });

      if (userToUpdate === null) {
        throw new Error(`User with id ${userIdToUpdate} doesn't exist`);
      }

      const isSubscribed =
        userToUpdate.subscribedToUserIds.includes(userIdToUnsubscribe);

      if (!isSubscribed) {
        throw new Error(
          `User with id ${userIdToUpdate} is not subscribed to user with id ${userIdToUnsubscribe}`
        );
      }

      const newSubscriptions = userToUpdate.subscribedToUserIds.filter(
        (id) => id !== userIdToUnsubscribe
      );

      return db.users.change(userIdToUpdate, {
        subscribedToUserIds: newSubscriptions,
      });
    },
    change: async (id: string, params: Partial<Omit<UserEntity, "id">>) => {
      const userIdToUpdate = id;

      try {
        return await db.users.change(userIdToUpdate, params);
      } catch (err) {
        throw err;
      }
    },
  };
};
