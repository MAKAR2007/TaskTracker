//функции логики обработки запросов CRUD (создание, чтения/получения, изменения и удаления)
//функции отражают логику запросов, формирующихся в приложении

export const resolvers = {
  Query: {
    //get all projects
    projects: async (parent, args, context) => {
      return await context.prisma.project.findMany();
    },

    //get all users
    users: async (parent, args, context) => {
      return await context.prisma.user.findMany();
    },
    //get all tasks
    tasks: async (parent, args, context) => {
      return await context.prisma.task.findMany();
    },
    //get one project by id
    project: async (parent, args, context) => {
      return await context.prisma.project.findUnique({
        where: {
          id: args.id,
        },
      });
    },

    //get one user by id
    user: async (parent, args, context) => {
      return await context.prisma.user.findUnique({
        where: {
          id: args.id,
        },
      });
    },
    //get one task by id
    task: async (parent, args, context) => {
      return await context.prisma.task.findUnique({
        where: {
          id: args.id,
        },
      });
    },
    //get files for specific task by tasks' id
    files: async (parent, args, context) => {
      return await context.prisma.file.findMany({
        where: {
          id: args.id,
        },
      });
    },
  },

  Project: {
    tasks: async (parent, args, context) => {
      return await context.prisma.task.findMany({
        where: {
          projectId: parent.id,
        },
      });
    },
  },

  Task: {
    comments: async (parent, args, context) => {
      return await context.prisma.comment.findMany({
        where: {
          taskId: parent.id,
        },
      });
    },
    files: async (parent, args, context) => {
      return await context.prisma.file.findMany({
        where: {
          taskId: parent.id,
        },
      });
    },
  },

  User: {
    tasks: async (parent, args, context) => {
      return await context.prisma.task.findMany({
        where: {
          userId: parent.id,
        },
      });
    },

    managedprjs: async (parent, args, context) => {
      return await context.prisma.project.findMany({
        where: {
          managerId: parent.id,
        },
      });
    },
  },

  Mutation: {
    addTask: async (parent, args, context) => {
      return await context.prisma.task.create({
        data: {
          title: args.title,
          stage: args.stage,
          priority: args.priority,
          projectId: args.projectId,
        },
      });
    },
    updateTask: async (parent, args, context) => {
      return await context.prisma.task.update({
        where: {
          id: args.id,
        },
        data: {
          title: args.title,
          stage: args.stage,
          priority: args.priority,
          projectId: args.projectId,
          description: args.description,
          endDate: args.endDate,
          project: args.project,
          user: args.user,
          userId: args.userId,
        },
      });
    },
    deleteTask: async (parent, args, context) => {
      return await context.prisma.task.delete({
        where: {
          id: args.id,
        },
      });
    },
    addComment: async (parent, args, context) => {
      return await context.prisma.comment.create({
        data: {
          taskId: args.taskId,
          comment: args.comment,
          user: args.user,
        },
      });
    },
    deleteComment: async (parent, args, context) => {
      return await context.prisma.comment.delete({
        where: {
          id: args.id,
        },
      });
    },
    addProject: async (parent, args, context) => {
      return await context.prisma.project.create({
        data: {
          title: args.title,
          description: args.description,
          managerId: args.managerId,
        },
      });
    },
    updateProject: async (parent, args, context) => {
      return await context.prisma.project.update({
        where: {
          id: args.id,
        },
        data: {
          title: args.title,
          description: args.description,
          managerId: args.managerId,
        },
      });
    },
    deleteProject: async (parent, args, context) => {
      return await context.prisma.project.delete({
        where: {
          id: args.id,
        },
      });
    },
    addUser: async (parent, args, context) => {
      return await context.prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: args.password,
          role: args.role,
          image: args.image,
          department: args.department,
        },
      });
    },
    updateUser: async (parent, args, context) => {
      return await context.prisma.user.update({
        where: {
          id: args.id,
        },
        data: {
          name: args.name,
          email: args.email,
          password: args.password,
          role: args.role,
          image: args.image,
          department: args.department,
        },
      });
    },
    deleteUser: async (parent, args, context) => {
      return await context.prisma.user.delete({
        where: {
          id: args.id,
        },
      });
    },
    deleteFile: async (parent, args, context) => {
      return await context.prisma.file.delete({
        where: {
          id: args.id,
        },
      });
    },
  },
};
