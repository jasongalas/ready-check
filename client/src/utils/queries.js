import { gql } from '@apollo/client';

export const QUERY_READY_CHECK = gql`
    query ReadyCheck($id: ID!) {
        readyCheck(id: $id) {
            id
            title
            whatToBeReadyFor
            whenToBeReady
            description
            users {
                id
                name
            }
            responses {
                userId
                answer
            }
            responseOptions
        }
    }
`;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      thoughts {
        _id
        thoughtText
        createdAt
      }
    }
  }
`;

export const QUERY_FRIENDS = gql`
    query Friends($userId: ID!) {
        user(id: $userId) {
            friends {
                id
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
      id
      name
    }
    readyCheck {
      id
      title
      description
    }

  }
`;