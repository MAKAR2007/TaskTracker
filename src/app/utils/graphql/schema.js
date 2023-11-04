// схемы данных для обработки запросов graphql через сервер Apollo

export const typeDefs = `#graphql
type Project {
  id: ID!
  title: String
  description: String
  tasks: [Task]
  manager: String
  managerId: String
  createdAt: String
  updatedAt: String
}

type Task {
  id: ID!
  title: String
  description: String
  comments: [Comment]
  files:[File]
  endDate: String
  stage: String
  priority: String
  project: String
  projectId: String
  user: String
  userId: String
  createdAt: String
  updatedAt: String
}

type User {
  id: ID!
  name: String
  password: String
  email: String
  emailVerified: String
  image: String
  department: String
  role: String
  managedprjs: [Project]
  tasks: [Task]
  createdAt: String
  updatedAt: String
}

type Comment {
  id: ID!
  comment: String
  task: String
  taskId: String
  user: String
  createdAt: String
  updatedAt: String
}

type File {
  id: ID!
  buffer: Int
  name: String
  task: String
  taskId: String
}

type Query {
  user (id:ID!): User
  users: [User]
  task (id:ID!): Task
  tasks:[Task]
  comment (id:ID!):Comment
  comments:[Comment]
  project (id:ID!):Project
  projects: [Project]
  file (id:ID!):File
  files:[File]
  }

type Mutation {
  addTask (title: String, stage: String, priority: String,  endDate: String, projectId: String, description: String,  project: String, user: String, userId: String): Task
  updateTask (id:ID!, title: String, stage: String, description: String,  endDate: String,   priority: String, userId: String): Task
  deleteTask (id:ID!): Task
  addComment(taskId:ID!, comment: String, user: String):Comment
  deleteComment (id:ID!): Comment
  addProject (title: String ,  description: String,   managerId: String) : Project
  updateProject (id:ID!,title: String ,  description: String,   managerId: String) : Project
  deleteProject (id:ID!): Project
  addUser(name: String, password: String, email: String, role: String, image: String, department: String ): User
  updateUser(id:ID!, name: String, password: String, email: String, role: String, image: String, department: String  ): User
  deleteUser (id:ID!): User
  deleteFile (id:ID!): File
  }
`;
