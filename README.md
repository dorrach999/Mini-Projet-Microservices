# Mini-Projet-Microservices
# Project Documentation

This documentation provides an overview of my project, including the architecture, technologies used, and details about the API endpoints available. It will help users understand how to interact with my project and provide instructions for setting it up locally.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
  - [GraphQL](#graphql)
  - [REST](#rest)
- [Database Structure](#Database-Structure)
- [Setup Instructions](#setup-instructions)
- [Usage Examples](#usage-examples)


## Project Overview

The project is a client-server application built using REST and GraphQL, where clients can perform actions on two microservices: the Department Microservice and the Teacher Microservice. The API Gateway serves as an intermediary, communicating with the microservices via gRPC and using Protobuf for data serialization. Apollo is used as the GraphQL implementation.The project also includes a MySQL database named db_dep_teacher with two tables: teachers and departments.

## Architecture

The architecture of the project follows a microservices pattern, with separate microservices for handling departments and teachers. The API Gateway acts as a single entry point for clients and communicates with the microservices via gRPC.. Here is an overview of the architecture:

```
Client <-> API Gateway <-> Department Microservice
                     <-> Teacher Microservice
```

## Technologies Used

The following technologies are used in this project:

- **REST** (Representational State Transfer): An architectural style for designing networked applications.
- **GraphQL**: A query language and runtime for APIs that provides a flexible and efficient approach to data fetching.
- **gRPC**: A high-performance, open-source framework for remote procedure calls (RPC).
- **Protobuf** (Protocol Buffers): A language-agnostic binary serialization format used for efficient data interchange.
- **Apollo**: An open-source GraphQL toolkit that provides a set of libraries and tools for building GraphQL applications.
- **Node.js**: A JavaScript runtime that allows executing JavaScript code outside a web browser.
- **Express.js**: A web application framework for Node.js that simplifies building APIs and web servers.

## API Endpoints

The project provides both GraphQL and REST endpoints to perform various actions on the Department and Teacher microservices.

### GraphQL

The GraphQL API, implemented using Apollo, can be accessed through the API Gateway running on port 3000. The following operations are supported:

#### Queries

- `department(id: Int!): Department`: Retrieve a department by its ID.
- `departments: [Department]`: Retrieve all departments.
- `teacher(id: Int!): Teacher`: Retrieve a teacher by their ID.
- `teachers: [Teacher]`: Retrieve all teachers.

#### Mutations

- `createDepartment(name: String!): Department!`: Create a new department.
- `updateDepartment(id: Int!, name: String!): Department!`: Update an existing department.
- `deleteDepartment(id: Int!): Boolean!`: Delete a department.
- `createTeacher(name: String!, lastname: String!, email: String!, departmentCode: Int!): Teacher!`: Create a new teacher.
- `updateTeacher(id: Int!, name: String, lastname: String, email: String!, departmentCode: Int!): Teacher!`: Update an existing teacher.
- `deleteTeacher(id: Int!): Boolean!`: Delete a teacher.

### REST

The REST API can be accessed through the API Gateway running on port 3000.

The following endpoints are available:

- **Department Endpoints**:
  - `GET /departments/:id`: Retrieve a department by its ID.
  - `GET /departments`: Retrieve all departments.
  - `POST /department`: Create a new department.
  - `PUT /departments/:id`: Update an

 existing department.
  - `DELETE /departments/:id`: Delete a department.

- **Teacher Endpoints**:
  - `GET /teachers/:id`: Retrieve a teacher by their ID.
  - `GET /teachers`: Retrieve all teachers.
  - `POST /teacher`: Create a new teacher.
  - `PUT /teachers/:id`: Update an existing teacher.
  - `DELETE /teachers/:id`: Delete a teacher.
  - `GET /teachers/department/:id`: Retrieve teachers by department ID.

## Database Structure

The project includes a MySQL database named `db_dep_teacher` with the following tables:

- **teachers**: Stores information about teachers.
  - `id` (INT): Teacher ID (primary key).
  - `name` (VARCHAR): Teacher's first name.
  - `lastname` (VARCHAR): Teacher's last name.
  - `email` (VARCHAR): Teacher's email address.
  - `departmentCode` (INT): Foreign key referencing the `departments` table.

- **departments**: Stores information about departments.
  - `id` (INT): Department ID (primary key).
  - `name` (VARCHAR): Department name.

## Setup Instructions

To set up the project locally, follow these steps:

1. Clone the repository from GitHub: `<repository URL>`
2. Install the required dependencies using a package manager like npm.
3. Set up the MySQL database with the name db_dep_teacher and import the file.
4. Start the Department Microservice on port 50051 by running `node departmentMicroservice.js`.
5. Start the Teacher Microservice on port 50054 by running `node teacherMicroservice.js`.
6. Start the API Gateway on port 3000 by running `node apigateway.js`.
7. The project is now set up locally and ready to use.

## Usage Examples

Here are some examples demonstrating how to interact with the project's API endpoints:

### GraphQL Examples

- Retrieve all departments:

  ```graphql
  query {
    departments {
      id
      name
    }
  }
  ```

- Create a new teacher:

  ```graphql
  mutation {
    createTeacher(name: "John", lastname: "Doe", email: "john.doe@example.com", departmentCode: 1) {
      id
      name
      lastname
      email
    }
  }
  ```

### REST Examples

- Retrieve a teacher by ID:

  ```
  GET /teachers/1
  ```

- Update an existing department:

  ```
  PUT /departments/2
  Body: { "name": "New Department Name" }
  ```

Refer to the API endpoints section for more details on available operations and request/response formats.


