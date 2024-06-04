import { gql } from '@apollo/client';

export const QUERY_READY_CHECK = gql`
    query ReadyCheck($id: ID!) {
        readyCheck(id: $id) {
            _id
            title
            activity
            timing
            description
            createdAt
            attendees {
                user
                status
            }
        }
    }
`;

export const QUERY_USERS = gql`
  query users($username: String!) {
    users(username: $username) {
      _id
      username
      email
    }
  }
`;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
    }
  }
`;

export const QUERY_FRIENDS = gql`
    query Friends($userId: ID!) {
        user(id: $userId) {
            friends {
                _id
                name
            }
        }
    }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      thoughts {
        _id
        thoughtText
        thoughtAuthor
        createdAt
      }
    }
  }
`;

export const QUERY_NOTIFICATIONS = gql`
  query notification {notifications(userId: $userId) {
    id
    type
    sender {
      _id
      name
    }
    readyCheck {
      _id
      title
      description
    }

  }
`;