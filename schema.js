const { gql } = require('@apollo/server');

const typeDefs = `#graphql
  type Department {
    id: Int!
    name: String!
  }

  type Teacher {
    id: Int!
    name: String!
    lastname: String!
    email: String!
    departmentCode : Int!
  }

  type Query {
    department(id: Int!): Department
    departments: [Department]
    teacher(id: Int!): Teacher
    teachers: [Teacher]
  }

  type Mutation {
    createDepartment(name: String!): Department!
    updateDepartment(id: Int!, name: String!): Department!
    deleteDepartment(id: Int!): Boolean!
    createTeacher(name: String!, lastname: String!, email: String!,departmentCode:Int!): Teacher!
    updateTeacher(id: Int!, name: String, lastname: String, email: String!,departmentCode:Int!): Teacher!
    deleteTeacher(id: Int!): Boolean!
  }
`;

module.exports = typeDefs;
