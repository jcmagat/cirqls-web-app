import { gql } from "@apollo/client";

export const POST_FRAGMENT = gql`
  fragment PostFragment on Post {
    post_id
    title
    description
    username
    created_since
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
