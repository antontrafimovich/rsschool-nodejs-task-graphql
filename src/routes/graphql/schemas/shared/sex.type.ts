import { GraphQLEnumType } from "graphql";

export const sexType = new GraphQLEnumType({
  name: "Sex",
  values: {
    Male: {
      value: "male",
    },
    Female: {
      value: "female",
    },
  },
});
