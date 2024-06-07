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

export const QUERY_INVITEES = gql`
  query GetUsers {
    getUsers {
      _id
      username
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
        username
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
      friends {
        _id
        username
      }
    }
  }
`;

export const QUERY_NOTIFICATIONS = gql`
  query notifications($userId: ID!) {
    notifications(userId: $userId) {
      _id
      type
      sender {
        _id
        username
      }
      readyCheck {
        _id
        title
        description
      }
    }
  }
`;
