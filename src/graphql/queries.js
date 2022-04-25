import { gql } from "@apollo/client";
import { POST_FRAGMENT, COMMENT_FRAGMENT, MESSAGE_FRAGMENT } from "./fragments";

/* ========== User Queries ========== */

export const GET_USER = gql`
  ${POST_FRAGMENT}
  ${COMMENT_FRAGMENT}
  query User($username: String!) {
    user(username: $username) {
      user_id
      username
      created_at
      profile_pic_src
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
      comments {
        ...CommentFragment
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
      user_id
      email
      username
      created_at
      profile_pic_src
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
      type
      logo_src
      moderators {
        user_id
      }
    }
  }
`;

export const GET_COMMUNITY = gql`
  ${POST_FRAGMENT}
  query Community($name: String!) {
    community(name: $name) {
      community_id
      name
      title
      description
      created_at
      type
      logo_src
      moderators {
        user_id
        username
        profile_pic_src
      }
      members {
        user_id
        username
      }
      posts {
        ...PostFragment
      }
    }
  }
`;

/* ========== Post Queries ========== */

export const GET_HOME_PAGE_POSTS = gql`
  ${POST_FRAGMENT}
  query HomePagePosts($sort: String!) {
    homePagePosts(sort: $sort) {
      ...PostFragment
    }
  }
`;

export const GET_EXPLORE_PAGE_POSTS = gql`
  ${POST_FRAGMENT}
  query ExplorePagePosts($sort: String!) {
    explorePagePosts(sort: $sort) {
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

/* ========== Message Queries ========== */

export const GET_CONVERSATIONS = gql`
  ${MESSAGE_FRAGMENT}
  query Conversations {
    conversations {
      user {
        user_id
        username
        profile_pic_src
      }
      messages {
        ...MessageFragment
      }
    }
  }
`;

export const GET_CONVERSATION = gql`
  ${MESSAGE_FRAGMENT}
  query Conversation($username: String!) {
    conversation(username: $username) {
      ...MessageFragment
    }
  }
`;

/* ========== Notification Queries ========== */

export const GET_NOTIFICATIONS = gql`
  ${MESSAGE_FRAGMENT}
  ${COMMENT_FRAGMENT}
  query Notifications {
    notifications {
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

/* ========== Search Queries ========== */

export const SEARCH = gql`
  query Search($term: String!) {
    search(term: $term) {
      ... on TextPost {
        __typename
        post_id
        title
        description
        created_at
        created_since
        poster {
          user_id
          username
        }
        community {
          community_id
          name
          logo_src
        }
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
      ... on MediaPost {
        __typename
        post_id
        title
        media_src
        created_at
        created_since
        poster {
          user_id
          username
        }
        community {
          community_id
          name
          logo_src
        }
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
      ... on User {
        __typename
        user_id
        username
        profile_pic_src
      }
      ... on Community {
        __typename
        community_id
        name
        title
        description
        logo_src
        members {
          user_id
        }
      }
    }
  }
`;
