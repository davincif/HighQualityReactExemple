import { gql } from "@apollo/client";

export const CHECK_USER = gql`
  query User($id: ID!) {
    user(id: $id) {
      _id
      name
      password
      active
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($data: UserInput!) {
    createUser(data: $data) {
      # _id
      nick
      name
      # password
      email
      birth
      accessLevel
      active
    }
  }
`;
