import { gql } from "@apollo/client";

/* ========== Auth Mutations ========== */

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

/* ========== User Mutations ========== */

export const FOLLOW = gql`
  mutation Follow($username: String!) {
    follow(username: $username) {
      username
      followers {
        count
        usernames
      }
    }
  }
`;

export const UNFOLLOW = gql`
  mutation Unfollow($username: String!) {
    unfollow(username: $username) {
      username
      followers {
        count
        usernames
      }
    }
  }
`;

/* ========== Post Mutations ========== */

export const ADD_POST = gql`
  mutation AddPost($title: String!, $description: String!) {
    addPost(title: $title, description: $description) {
      post_id
      title
      description
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
      reactions {
        likes
        dislikes
        total
        auth_user_reaction
      }
    }
  }
`;

export const DELETE_POST_REACTION = gql`
  mutation DeletePostReaction($post_id: Int!) {
    deletePostReaction(post_id: $post_id) {
      post_id
      reactions {
        likes
        dislikes
        total
        auth_user_reaction
      }
    }
  }
`;

/* ========== Comment Mutations ========== */

export const ADD_COMMENT = gql`
  mutation AddComment(
    $parent_comment_id: Int
    $post_id: Int!
    $message: String!
  ) {
    addComment(
      parent_comment_id: $parent_comment_id
      post_id: $post_id
      message: $message
    ) {
      comment_id
      parent_comment_id
      post_id
      username
      message
      created_since
      reactions {
        likes
        dislikes
        total
        auth_user_reaction
      }
      child_comments {
        comment_id
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($comment_id: Int!) {
    deleteComment(comment_id: $comment_id) {
      comment_id
    }
  }
`;

export const ADD_COMMENT_REACTION = gql`
  mutation AddCommentReaction($comment_id: Int!, $reaction: String!) {
    addCommentReaction(comment_id: $comment_id, reaction: $reaction) {
      comment_id
      reactions {
        likes
        dislikes
        total
        auth_user_reaction
      }
    }
  }
`;

export const DELETE_COMMENT_REACTION = gql`
  mutation DeleteCommentReaction($comment_id: Int!) {
    deleteCommentReaction(comment_id: $comment_id) {
      comment_id
      reactions {
        likes
        dislikes
        total
        auth_user_reaction
      }
    }
  }
`;
