import { gql } from "@apollo/client";
import { MESSAGE_FRAGMENT } from "./fragments";

export const NEW_MESSAGE = gql`
  ${MESSAGE_FRAGMENT}
  subscription NewMessage {
    newMessage {
      ...MessageFragment
    }
  }
`;
