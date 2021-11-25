import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query Posts {
    posts {
      post_id
      title
      description
      user_id
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
