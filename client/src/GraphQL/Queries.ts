import { gql } from "@apollo/client";

export const USER_LOGIN = gql`
  query login($nick: String!, $password: String!) {
    login(nick: $nick, password: $password) {
      # _id
      nick
      name
      # password
      email
      birth
      accessLevel
      active
      # __typename
    }
  }
`;

export const USER_CREATE = gql`
  mutation createUser($data: UserInput!) {
    createUser(data: $data) {
      accessLevel
    }
  }
`;
