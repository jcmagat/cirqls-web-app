import { gql } from "@apollo/client";
import { POST_FRAGMENT, COMMENT_FRAGMENT } from "./fragments";

/* ========== User Queries ========== */

export const GET_USER = gql`
  ${POST_FRAGMENT}
  query User($username: String!) {
    user(username: $username) {
      username
      created_at
      following {
        username
        followed_at
      }
      followers {
        username
        followed_at
      }
      posts {
        ...PostFragment
      }
      saved_posts {
        ...PostFragment
      }
    }
  }
`;

export const GET_AUTH_USER = gql`
  query AuthUser {
    authUser {
      username
      created_at
      following {
        username
      }
      followers {
        username
      }
      posts {
        post_id
      }
      saved_posts {
        post_id
      }
    }
  }
`;

/* ========== Community Queries ========== */

export const GET_COMMUNITIES = gql`
  query Communities {
    communities {
      community_id
      name
    }
  }
`;

/* ========== Post Queries ========== */

export const GET_POSTS = gql`
  ${POST_FRAGMENT}
  query Posts {
    posts {
      ...PostFragment
    }
  }
`;

export const GET_POST = gql`
  ${POST_FRAGMENT}
  query Post($post_id: Int!) {
    post(post_id: $post_id) {
      ...PostFragment
    }
  }
`;

/* ========== Comment Queries ========== */

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
