import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query {
    posts {
      id
      title
      message
      postedOn
      postedSince
      postedBy
      likes
      likedByMe
    }
  }
`;
