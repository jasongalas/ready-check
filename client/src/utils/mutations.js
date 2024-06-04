import { gql } from '@apollo/client';

export const CREATE_READY_CHECK = gql`
    mutation CreateReadyCheck($input: ReadyCheckInput!) {
        createReadyCheck(input: $input) {
            id
            title
            activity
            timing
            description
            users
            responseOptions
        }
    }
`;

export const UPDATE_READY_CHECK = gql`
    mutation UpdateReadyCheck($id: ID!, $input: ReadyCheckInput!) {
        updateReadyCheck(id: $id, input: $input) {
            id
            title
            activity
            timing
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

export const UPDATE_USER_STATUS = gql`
    mutation UpdateUserStatus($userId: ID!, $status: String!) {
        updateUserStatus(userId: $userId, status: $status) {
            id
            status
        }
    }
`;


export const ADD_FRIEND = gql`
    mutation AddFriend($userId: ID!, $friendId: ID!) {
        addFriend(userId: $userId, friendId: $friendId) {
            id
            friends {
                id
                name
            }
        }
    }
`;

export const REMOVE_FRIEND = gql`
    mutation RemoveFriend($userId: ID!, $friendId: ID!) {
        removeFriend(userId: $userId, friendId: $friendId) {
            id
            friends {
                id
                name
            }
        }
    }
`;

//

export const LOGIN_USER = gql`
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

export const ADD_USER = gql`
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

// export const ADD_THOUGHT = gql`
//   mutation addThought($thoughtText: String!) {
//     addThought(thoughtText: $thoughtText) {
//       _id
//       thoughtText
//       thoughtAuthor
//       createdAt
//       comments {
//         _id
//         commentText
//       }
//     }
//   }
// `;

// export const ADD_COMMENT = gql`
//   mutation addComment($thoughtId: ID!, $commentText: String!) {
//     addComment(thoughtId: $thoughtId, commentText: $commentText) {
//       _id
//       thoughtText
//       thoughtAuthor
//       createdAt
//       comments {
//         _id
//         commentText
//         createdAt
//       }
//     }
//   }
// `;
