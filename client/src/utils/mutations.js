import { gql } from '@apollo/client';

export const CREATE_READY_CHECK = gql`
mutation CreateReadyCheck($input: ReadyCheckInput!) {
  createReadyCheck(input: $input) {
    _id
    title
    activity
    createdAt
    description
    invitees {
      _id
    }
    timing
  }
}
`;

export const UPDATE_READY_CHECK = gql`
    mutation UpdateReadyCheck($id: ID!, $title: String!, $description: String) {
        updateReadyCheck(id: $id, title: $title, description: $description) {
            _id
            title
            activity
            timing
            description
            createdAt
            invitees {
                user {
                    _id
                    username
                }
                status
            }
        }
    }
`;

export const UPDATE_USER_STATUS = gql`
    mutation UpdateUserStatus($status: String!) {
        updateUserStatus(status: $status) {
            _id
            status
        }
    }
`;

export const ADD_FRIEND = gql`
    mutation followFriend($username: String!) {
      followFriend(username: $username) {
            _id
            friends {
                _id
                username
            }
        }
    }
`;

export const REMOVE_FRIEND = gql`
    mutation unfollowFriend($username: String!) {
      unfollowFriend(username: $username) {
            _id
            friends {
                _id
                username
            }
        }
    }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
