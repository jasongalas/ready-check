import { gql } from '@apollo/client';

export const CREATE_READY_CHECK = gql`
    mutation CreateReadyCheck($input: ReadyCheckInput!) {
        createReadyCheck(input: $input) {
            id
            title
            whatToBeReadyFor
            whenToBeReady
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
