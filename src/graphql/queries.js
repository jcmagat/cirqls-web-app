import { gql } from "@apollo/client";
import { COMMENT_FRAGMENT } from "./fragments";

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
      comments_info {
        total
      }
    }
  }
`;

export const GET_POST = gql`
  query Post($post_id: Int!) {
    post(post_id: $post_id) {
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
      comments_info {
        total
        comment_ids
      }
    }
  }
`;

export const GET_COMMENTS = gql`
  ${COMMENT_FRAGMENT}
  query Comments($post_id: Int!) {
    comments(post_id: $post_id) {
      ...CommentFragment
      child_comments {
        ...CommentFragment
        child_comments {
          ...CommentFragment
          child_comments {
            ...CommentFragment
            child_comments {
              ...CommentFragment
              child_comments {
                ...CommentFragment
                child_comments {
                  ...CommentFragment
                  child_comments {
                    ...CommentFragment
                    child_comments {
                      ...CommentFragment
                      child_comments {
                        ...CommentFragment
                        child_comments {
                          ...CommentFragment
                          child_comments {
                            ...CommentFragment
                            child_comments {
                              ...CommentFragment
                              child_comments {
                                ...CommentFragment
                                child_comments {
                                  ...CommentFragment
                                  child_comments {
                                    ...CommentFragment
                                    child_comments {
                                      ...CommentFragment
                                      child_comments {
                                        ...CommentFragment
                                        child_comments {
                                          ...CommentFragment
                                          child_comments {
                                            ...CommentFragment
                                            child_comments {
                                              ...CommentFragment
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
