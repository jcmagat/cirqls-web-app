import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation Mutation($email: String!, $username: String!, $password: String!) {
    register(email: $email, username: $username, password: $password) {
      registered
    }
  }
`;

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
  mutation Mutation($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

export const LIKE_POST = gql`
  mutation Mutation($id: ID!) {
    likePost(id: $id) {
      id
      likes
    }
  }
`;
