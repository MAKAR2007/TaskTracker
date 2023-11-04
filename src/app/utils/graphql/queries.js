//запросы на получение данных

import { gql } from "graphql-tag";

export const PRJ_QUERY = gql`
  query projects {
    projects {
      id
      title
      description
      tasks {
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
        files {
          name
          id
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
      manager
      managerId
      createdAt
      updatedAt
    }
    users {
      id
      name
      email
      emailVerified
      image
      department
      role
      managedprjs {
        id
      }
      tasks {
        id
      }
      createdAt
      updatedAt
    }
  }
`;

export const sPRJ_QUERY = gql`
  query project($projectId: ID!) {
    project(id: $projectId) {
      title
      manager
      managerId
      description
      id
    }
  }
`;
export const TASKS_QUERY = gql`
  query tasks {
    tasks {
      id
      title
      description
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

export const TASK_QUERY = gql`
  query task($id: ID!) {
    task(id: $id) {
      id
      title
      description
      comments {
        id
        comment
        user
      }
      files {
        name
        id
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

export const USERS_QUERY = gql`
  query users {
    users {
      id
      name
      password
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
export const USER_QUERY = gql`
  query user($id: ID!) {
    user(id: $id) {
      email
      id
      image
      department
      name
      role
    }
  }
`;
