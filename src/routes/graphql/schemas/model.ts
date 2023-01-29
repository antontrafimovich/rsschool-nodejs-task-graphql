import { UserService } from "../../../services";
import DB from "../../../utils/DB/DB";

export type ResolverContext = {
  db: DB;
  services: {
    userService: UserService;
  };
};
