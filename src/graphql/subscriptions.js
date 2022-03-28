import { gql } from "@apollo/client";
import { MESSAGE_FRAGMENT, COMMENT_FRAGMENT } from "./fragments";

export const NEW_MESSAGE = gql`
  ${MESSAGE_FRAGMENT}
  subscription NewMessage {
    newMessage {
      ...MessageFragment
    }
  }
`;

export const NEW_NOTIFICATION = gql`
  ${MESSAGE_FRAGMENT}
  ${COMMENT_FRAGMENT}
  subscription NewNotification {
    newNotification {
      ... on Message {
        __typename
        ...MessageFragment
      }
      ... on Comment {
        __typename
        ...CommentFragment
      }
    }
  }
`;
