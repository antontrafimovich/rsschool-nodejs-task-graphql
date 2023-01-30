import {
  MemberTypeService,
  PostService,
  ProfileService,
  UserService,
} from "../../../services";

export type ResolverContext = {
  services: {
    userService: UserService;
    profileService: ProfileService;
    memberTypeService: MemberTypeService;
    postService: PostService;
  };
};
