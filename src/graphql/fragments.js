import { gql } from "@apollo/client";

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    user_id
    username
    created_at
    profile_pic_src
  }
`;

export const POST_FRAGMENT = gql`
  fragment PostFragment on Post {
    __typename
    post_id
    title
    created_at
    created_since
    poster {
      user_id
      username
    }
    community {
      community_id
      name
      logo_src
    }
    reactions {
      likes
      dislikes
      total
      auth_user_reaction
    }
    comments_info {
      total
      comment_ids
    }
    ... on TextPost {
      description
    }
    ... on MediaPost {
      media_src
    }
  }
`;

export const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on Comment {
    comment_id
    parent_comment_id
    post_id
    message
    created_since
    commenter {
      user_id
      username
      profile_pic_src
    }
    reactions {
      likes
      dislikes
      total
      auth_user_reaction
    }
  }
`;

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFragment on Message {
    message_id
    message
    sent_at
    is_read
    sender {
      user_id
      username
    }
    recipient {
      user_id
      username
    }
  }
`;
