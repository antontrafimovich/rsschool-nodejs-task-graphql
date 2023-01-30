import {
  MemberTypeService,
  PostService,
  ProfileService,
  UserService,
} from "../../../services";
import DB from "../../../utils/DB/DB";

export type ResolverContext = {
  db: DB;
  services: {
    userService: UserService;
    profileService: ProfileService;
    memberTypeService: MemberTypeService;
    postService: PostService;
  };
};
