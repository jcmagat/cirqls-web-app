import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      accessToken
      refreshToken
      accessTokenExpiration
      refreshTokenExpiration
    }
  }
`;

export const ADD_POST = gql`
  mutation Mutation($title: String!, $message: String!) {
    addPost(title: $title, message: $message) {
      id
      title
      message
      postedOn
      postedSince
      postedBy
      likes
    }
  }
`;

export const DELETE_POST = gql`
  mutation Mutation($id: String!) {
    deletePost(id: $id) {
      id
    }
  }
`;
