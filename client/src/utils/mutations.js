import { gql } from '@apollo/client';

export const CREATE_READY_CHECK = gql`
    mutation CreateReadyCheck($title: String!, $description: String) {
        createReadyCheck(title: $title, description: $description) {
            _id
            title
            activity
            timing
            description
            createdAt
            attendees {
                user {
                    _id
                    username
                }
                status
            }
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
            attendees {
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
            profile {
                status
            }
        }
    }
`;

export const ADD_FRIEND = gql`
    mutation AddFriend($username: String!) {
        addFriend(username: $username) {
            id
            friends {
                id
                name
            }
        }
    }
`;

export const REMOVE_FRIEND = gql`
    mutation RemoveFriend($username: String!) {
        removeFriend(username: $username) {
            id
            friends {
                id
                name
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
