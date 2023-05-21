const { gql } = require('@apollo/server');

const depSchema = `#graphql
  type Department {
    id: Int!
    name: String!
  }
  
  type Teacher {
    id: Int!
    name: String!
    lastname: String!
    email: String!
    departmentCode: Int!
  }
  type Query {
    department(id: Int!): Department
    departments: [Department]
    teacherslist(departmentCode: Int!): [Teacher]
  }

  type Mutation {
    createDepartment(name: String!): Department!
    updateDepartment(id: Int!, name: String!): Department!
    deleteDepartment(id: Int!): Boolean!
  }
`;

module.exports = depSchema;
