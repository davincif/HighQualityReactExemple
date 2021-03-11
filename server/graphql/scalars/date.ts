/// https://www.apollographql.com/docs/apollo-server/schema/custom-scalars/

// Third party libs
import { GraphQLScalarType } from "graphql";

// Internal imports
import { loadFormatedDate, standardFormat } from "../../utils/times";

export const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value: Date) {
    // value is a invalid date
    if (isNaN(value.getTime())) {
      throw new Error("Date is invalid");
    }

    return standardFormat(value);
  },
  parseValue(value) {
    return loadFormatedDate(value);
  },
});
