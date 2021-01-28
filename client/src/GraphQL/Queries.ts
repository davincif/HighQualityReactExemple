import { gql } from "@apollo/client";

export const LOAD_USERS = gql`
  query users {
    _id
    name
    password
    active
  }
`;

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
