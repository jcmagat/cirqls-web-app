import { gql } from "@apollo/client";
import { COMMENT_FRAGMENT, MESSAGE_FRAGMENT } from "./fragments";

/* ========== Auth Mutations ========== */

export const SIGNUP = gql`
  mutation Signup($email: String!) {
    signup(email: $email) {
      success
    }
  }
`;

export const REGISTER = gql`
  mutation Register($token: String!, $username: String!, $password: String!) {
    register(token: $token, username: $username, password: $password) {
      success
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
      user_id
      username
      followers {
        username
        followed_at
      }
    }
  }
`;

export const UNFOLLOW = gql`
  mutation Unfollow($username: String!) {
    unfollow(username: $username) {
      user_id
      username
      followers {
        username
        followed_at
      }
    }
  }
`;

export const REMOVE_FOLLOWER = gql`
  mutation RemoveFollower($username: String!) {
    removeFollower(username: $username) {
      user_id
      username
    }
  }
`;

export const CHANGE_EMAIL = gql`
  mutation ChangeEmail($password: String!, $new_email: String!) {
    changeEmail(password: $password, new_email: $new_email) {
      user_id
      email
    }
  }
`;

export const CHANGE_USERNAME = gql`
  mutation ChangeUsername($username: String!) {
    changeUsername(username: $username) {
      user_id
      username
    }
  }
`;

export const CHANGE_PROFILE_PIC = gql`
  mutation ChangeProfilePic($profile_pic: Upload!) {
    changeProfilePic(profile_pic: $profile_pic) {
      user_id
      profile_pic_src
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($current_password: String!, $new_password: String!) {
    changePassword(
      current_password: $current_password
      new_password: $new_password
    ) {
      user_id
    }
  }
`;

export const CONFIRM_DELETE_ACCOUNT = gql`
  mutation ConfirmDeleteAccount($password: String!) {
    confirmDeleteAccount(password: $password) {
      success
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($token: String!) {
    deleteAccount(token: $token) {
      success
    }
  }
`;

/* ========== Community Mutations ========== */

export const JOIN = gql`
  mutation Join($community_id: Int!) {
    join(community_id: $community_id) {
      community_id
      members {
        user_id
        username
      }
    }
  }
`;

export const LEAVE = gql`
  mutation Leave($community_id: Int!) {
    leave(community_id: $community_id) {
      community_id
      members {
        user_id
        username
      }
    }
  }
`;

export const CREATE_COMMUNITY = gql`
  mutation CreateCommunity(
    $name: String!
    $title: String!
    $description: String!
    $logo: Upload
  ) {
    createCommunity(
      name: $name
      title: $title
      description: $description
      logo: $logo
    ) {
      community_id
      name
      title
      description
      logo_src
    }
  }
`;

export const EDIT_COMMUNITY = gql`
  mutation EditCommunity(
    $community_id: Int!
    $title: String
    $description: String
    $logo: Upload
  ) {
    editCommunity(
      community_id: $community_id
      title: $title
      description: $description
      logo: $logo
    ) {
      community_id
      title
      description
      logo_src
    }
  }
`;

/* ========== Post Mutations ========== */

export const ADD_TEXT_POST = gql`
  mutation AddTextPost(
    $title: String!
    $description: String!
    $community_id: Int!
  ) {
    addTextPost(
      title: $title
      description: $description
      community_id: $community_id
    ) {
      post_id
    }
  }
`;

export const ADD_MEDIA_POST = gql`
  mutation AddMediaPost($title: String!, $media: Upload!, $community_id: Int!) {
    addMediaPost(title: $title, media: $media, community_id: $community_id) {
      post_id
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

export const SAVE_POST = gql`
  mutation SavePost($post_id: Int!) {
    savePost(post_id: $post_id) {
      post_id
    }
  }
`;

export const UNSAVE_POST = gql`
  mutation UnsavePost($post_id: Int!) {
    unsavePost(post_id: $post_id) {
      post_id
    }
  }
`;

/* ========== Comment Mutations ========== */

export const ADD_COMMENT = gql`
  ${COMMENT_FRAGMENT}
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
      ...CommentFragment
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

export const READ_COMMENTS = gql`
  ${COMMENT_FRAGMENT}
  mutation ReadComments($comment_ids: [Int]!) {
    readComments(comment_ids: $comment_ids) {
      ...CommentFragment
    }
  }
`;

/* ========== Message Mutations ========== */

export const SEND_MESSAGE = gql`
  ${MESSAGE_FRAGMENT}
  mutation SendMessage($recipient: String!, $message: String!) {
    sendMessage(recipient: $recipient, message: $message) {
      ...MessageFragment
    }
  }
`;

export const READ_MESSAGES = gql`
  mutation ReadMessages($message_ids: [Int]!) {
    readMessages(message_ids: $message_ids) {
      message_id
      is_read
    }
  }
`;
