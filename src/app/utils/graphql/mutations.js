//запросы на добавление, изменение или удаление данных

import { gql } from "graphql-tag";

export const ADD_TASK = gql`
  mutation AddTask(
    $title: String
    $stage: String
    $priority: String
    $projectId: String
  ) {
    addTask(
      title: $title
      stage: $stage
      priority: $priority
      projectId: $projectId
    ) {
      id
      title
      description
      comments {
        id
        comment
        task
        taskId
        user
        createdAt
        updatedAt
      }
      endDate
      stage
      priority
      project
      projectId
      user
      userId
      createdAt
      updatedAt
    }
  }
`;
export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $stage: String
    $description: String
    $endDate: String
    $priority: String
    $userId: String
  ) {
    updateTask(
      id: $id
      title: $title
      stage: $stage
      description: $description
      endDate: $endDate
      priority: $priority
      userId: $userId
    ) {
      id
      title
      description
      comments {
        id
        comment
        task
        taskId
        user
        createdAt
        updatedAt
      }
      endDate
      stage
      priority
      project
      projectId
      user
      userId
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
      title
      description
      comments {
        id
        comment
        task
        taskId
        user
        createdAt
        updatedAt
      }
      endDate
      stage
      priority
      project
      projectId
      user
      userId
      createdAt
      updatedAt
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($taskId: ID!, $comment: String, $user: String) {
    addComment(taskId: $taskId, comment: $comment, user: $user) {
      id
      comment
      task
      taskId
      user
      createdAt
      updatedAt
    }
  }
`;

export const ADD_PROJECT = gql`
  mutation AddProject(
    $title: String
    $description: String
    $managerId: String
  ) {
    addProject(
      title: $title
      description: $description
      managerId: $managerId
    ) {
      id
      title
      description
      managerId
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation updateProject(
    $id: ID!
    $title: String
    $description: String
    $managerId: String
  ) {
    updateProject(
      id: $id
      title: $title
      description: $description
      managerId: $managerId
    ) {
      id
      managerId
      description
      title
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
      managerId
      title
      description
    }
  }
`;
export const ADD_USER = gql`
  mutation AddUser(
    $name: String
    $password: String
    $email: String
    $role: String
    $image: String
    $department: String
  ) {
    addUser(
      name: $name
      password: $password
      email: $email
      role: $role
      image: $image
      department: $department
    ) {
      id
      name
      email
      emailVerified
      image
      department
      role
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $name: String
    $password: String
    $email: String
    $role: String
    $image: String
    $department: String
  ) {
    updateUser(
      id: $id
      name: $name
      password: $password
      email: $email
      role: $role
      image: $image
      department: $department
    ) {
      id
      name
      email
      image
      department
      role
      password
    }
  }
`;
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      name
      email
      image
      department
      role
    }
  }
`;

export const DELETE_FILE = gql`
  mutation DeleteFile($id: ID!) {
    deleteFile(id: $id) {
      id
      name
    }
  }
`;
export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
      id
      comment
    }
  }
`;
