const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require ('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const departmentProtoPath = 'department.proto';
const teacherProtoPath = 'teacher.proto';

const departmentResolvers = require('./departmentResolvers');
const teacherResolvers = require('./teacherResolvers');
const depSchema = require('./Schemas/departmentSchema');
const teacherSchema = require('./Schemas/teacherSchema');


const app = express();
app.use(bodyParser.json());

const departmentProtoDefinition = protoLoader.loadSync(departmentProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const teacherProtoDefinition = protoLoader.loadSync(teacherProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const departmentProto = grpc.loadPackageDefinition(departmentProtoDefinition);
const clientDepartments = new departmentProto.DepartmentService('localhost:50051', grpc.credentials.createInsecure());
const teacherProto = grpc.loadPackageDefinition(teacherProtoDefinition);
const clientTeachers = new teacherProto.TeacherService('localhost:50054', grpc.credentials.createInsecure());

const mergedSchema = makeExecutableSchema({
  typeDefs: mergeTypeDefs([depSchema, teacherSchema]),
  resolvers: [departmentResolvers, teacherResolvers],
});

const server = new ApolloServer({
  schema: mergedSchema,
});

server.start().then(() => {
  app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server),
  );
});


app.get('/departments', (req, res) => {
  clientDepartments.getDepartments({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.departments);
    }
  });
});

app.get('/departments/:id', (req, res) => {
  const id = req.params.id;
  clientDepartments.findDepartment({ department_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.department);
    }
  });
});

app.post('/department', (req, res) => {
  const { id, name } = req.body;
  clientDepartments.createDepartment({ dep_id: id, name: name }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.department);
    }
  });
});

app.delete('/departments/:id', (req, res) => {
  const id = req.params.id;
  clientDepartments.deleteDepartment({ department_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ success: true });
    }
  });
});

app.put('/departments/:id', (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  clientDepartments.updateDepartment({ dep_id: id, name: name }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.department);
    }
  });
});
app.get('/teachers', (req, res) => {
  clientTeachers.getTeachers({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.teachers);
    }
  });
});

app.get('/teachers/:id', (req, res) => {
  const id = req.params.id;
  clientTeachers.findTeacher({ teacher_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.teacher);
    }
  });
});

app.post('/teacher', (req, res) => {
  const { id, name ,lastname,email,departmentCode} = req.body;
  clientTeachers.createTeacher({ teacher_id: id, name: name, lastname: lastname,email: email,departmentCode:departmentCode}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.teacher);
    }
  });
});

app.delete('/teachers/:id', (req, res) => {
  const id = req.params.id;
  clientTeachers.deleteTeacher({ teacher_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ success: true });
    }
  });
});

app.put('/teachers/:id', (req, res) => {
  const id = req.params.id;
  const { name,lastname,email,departmentCode } = req.body;
  clientTeachers.updateTeacher({ teacher_id: id, name: name , lastname: lastname,email: email,departmentCode:departmentCode}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.teacher);
    }
  });
});

app.get('/teachers/department/:id', (req, res) => {
  const id = req.params.id;
  clientDepartments.getTeachersByDepartment({departmentId:id}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.teacherslist);
    }
  });
}); 

const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
