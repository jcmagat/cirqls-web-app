import { gql } from "@apollo/client";

export const POST_FRAGMENT = gql`
  fragment PostFragment on Post {
    post_id
    title
    created_since
    poster {
      username
    }
    community {
      community_id
      name
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
    username
    message
    created_since
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
    sender {
      username
    }
    recipient {
      username
    }
  }
`;
