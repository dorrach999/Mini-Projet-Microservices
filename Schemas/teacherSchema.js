const { gql } = require('@apollo/server');

const teacherSchema = `#graphql
  

  type Teacher {
    id: Int!
    name: String!
    lastname: String!
    email: String!
    departmentCode : Int!
  }

  type Query {
    teacher(id: Int!): Teacher
    teachers: [Teacher]
  }

  type Mutation {
    createTeacher(name: String!, lastname: String!, email: String!,departmentCode:Int!): Teacher!
    updateTeacher(id: Int!, name: String, lastname: String, email: String!,departmentCode:Int!): Teacher!
    deleteTeacher(id: Int!): Boolean!
  }
`;

module.exports = teacherSchema;
