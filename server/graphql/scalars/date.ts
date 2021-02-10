// https://www.apollographql.com/docs/apollo-server/schema/custom-scalars/
import { GraphQLScalarType } from "graphql";

export const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value: Date) {
    // value is a invalid date
    if (isNaN(value.getTime())) {
      throw new Error("Date is invalid");
    }

    return `${value.getDate()}/${value.getMonth()}/${value.getFullYear()}`;
  },
  parseValue(value) {
    let date = value.split("/");
    return new Date(date[2], date[1] - 1, date[0]);
  },
});
