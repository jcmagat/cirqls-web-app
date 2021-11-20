import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query Posts {
    posts {
      post_id
      title
      description
      username
      created_since
      reactions {
        likes
        dislikes
        total
      }
    }
  }
`;
