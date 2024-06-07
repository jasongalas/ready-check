import { gql } from '@apollo/client';

export const QUERY_READY_CHECK = gql`
  query getReadyCheck($id: ID!) {
    getReadyCheck(id: $id) {
      _id
      title
      activity
      timing
      description
      createdAt
      invitees {
        _id
        username
      }
      RSVPs {
        user {
          _id
          username
        }
        reply
      }
      owner {
        _id
        username
      }
    }
  }
`;

export const QUERY_READY_CHECKS = gql`
  query readyChecks {
    readyChecks {
      _id
      title
      activity
      timing
      description
      createdAt
      invitees {
        _id
        username
      }
      RSVPs {
        user {
          _id
          username
        }
        reply
      }
      owner {
        _id
        username
      }
    }
  }
`;


export const QUERY_USERS = gql`
  query getUsers($username: String!) {
    getUsers(username: $username) {
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
  query getUser($username: String!) {
    getUser(username: $username) {
      _id
      username
      email
      bio
    }
  }
`;

export const QUERY_FRIENDS = gql`
  query getFriends($userId: ID!) {
    getFriends(userId: $userId) {
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
      bio
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
