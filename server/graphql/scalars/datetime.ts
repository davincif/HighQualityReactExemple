/// https://www.apollographql.com/docs/apollo-server/schema/custom-scalars/

// Third party libs
import { GraphQLScalarType } from "graphql";

// Internal imports
import { loadFormatedDate, standardFormat } from "../../utils/times";

export const dateTimeScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value: Date) {
    // check if value is a invalid date
    let isnan: boolean;
    try {
      isnan = isNaN(value.getTime());
    } catch (error) {
      throw new Error("Date has the wrong type.");
    }
    if (isnan) {
      throw new Error("Date is invalid.");
    }

    return standardFormat(value);
  },
  parseValue(value) {
    return loadFormatedDate(value);
  },
});
