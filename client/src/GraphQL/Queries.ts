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
  mutation createUser(
    $nick: String!
    $name: String!
    $password: String!
    $email: String!
    $birth: String!
    $accessLevel: Date
    $active: Boolean
  ) {
    createUser(
      nick: $nick
      name: $name
      password: $password
      email: $email
      birth: $birth
      accessLevel: $accessLevel
      active: $active
    ) {
      nick
      name
      password
      email
      birth
      accessLevel
      active
    }
  }
`;
