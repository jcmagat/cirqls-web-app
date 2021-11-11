import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query Posts {
    posts {
      post_id
      title
      description
      created_at
      user_id
    }
  }
`;
