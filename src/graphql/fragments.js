import { gql } from "@apollo/client";

export const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on Comment {
    comment_id
    parent_comment_id
    post_id
    username
    message
    created_since
  }
`;
