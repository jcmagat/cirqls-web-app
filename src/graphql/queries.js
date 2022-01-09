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

/* ========== Post Queries ========== */

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
