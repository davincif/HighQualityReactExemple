import { gql } from "@apollo/client";

export const USER_DIRECTORIES = gql`
  query userDirectories($id: String) {
    userDirectories(id: $id) {
      _id
      name
      father
      directories
      files
      owner
      createdAt
      createdBy
      modifiedAt
      modifiedBy
      access {
        user
        level
      }
      # __typename
    }
  }
`;
