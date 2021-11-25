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
      user_id
      accessToken
      refreshToken
      accessTokenExpiration
      refreshTokenExpiration
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($title: String!, $description: String!) {
    addPost(title: $title, description: $description) {
      post_id
      title
      description
      user_id
      username
      created_since
      reactions {
        likes
        dislikes
        total
        auth_user_reaction
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($post_id: Int!) {
    deletePost(post_id: $post_id) {
      post_id
    }
  }
`;

export const ADD_POST_REACTION = gql`
  mutation AddPostReaction($post_id: Int!, $reaction: String!) {
    addPostReaction(post_id: $post_id, reaction: $reaction) {
      post_id
      username
      reaction
    }
  }
`;

export const DELETE_POST_REACTION = gql`
  mutation DeletePostReaction($post_id: Int!) {
    deletePostReaction(post_id: $post_id) {
      post_id
      username
      reaction
    }
  }
`;
