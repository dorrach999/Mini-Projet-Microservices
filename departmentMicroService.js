const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_dep_teacher',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

const departmentProtoPath = 'department.proto';
const departmentProtoDefinition = protoLoader.loadSync(departmentProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const departmentPackage = grpc.loadPackageDefinition(departmentProtoDefinition);
const departmentServiceDefinition = departmentPackage.DepartmentService;

const departmentService = {
  
  findDepartment: (call, callback) => {
    const departmentId = call.request.department_id;
    const query = 'SELECT * FROM departments WHERE id = ?';

    connection.query(query, [departmentId], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }

      if (results.length === 0) {
        const error = new Error('Department not found');
        callback(error);
        return;
      }

      const department = results[0];
      callback(null, {
        department: {
          id: department.id,
          name: department.name,
        },
      });
    });
  },

  getDepartments: (call, callback) => {
    connection.query('SELECT * FROM departments', (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }

      const departments = results.map((department) => ({
        id: department.id,
        name: department.name,
      }));

      callback(null, { departments });
    });
  },

  createDepartment: (call, callback) => {
    const { dep_id, name } = call.request;

    connection.query(
      'INSERT INTO departments (id, name) VALUES (?, ?)',
      [dep_id, name],
      (error, result) => {
        if (error) {
          console.error(error);
          callback(error);
          return;
        }

        callback(null, {
          department: {
            id: result.insertId,
            name,
          },
        });
      }
    );
  },

  deleteDepartment: (call, callback) => {
    const departmentId = call.request.department_id;
    const query = 'DELETE FROM departments WHERE id = ?';

    connection.query(query, [departmentId], (error, result) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }

      callback(null, { success: true });
    });
  },

  updateDepartment: (call, callback) => {
    const { dep_id, name } = call.request;
    const query = 'UPDATE departments SET name = ? WHERE id = ?';

    connection.query(query, [name, dep_id], (error, result) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }

      callback(null, {
        department: {
          id: dep_id,
          name,
        },
      });
    });
  },
  getTeachersByDepartment: (call, callback) => {
    const department_Id = call.request.departmentId;
    const query = `SELECT * FROM teachers where departmentCode = ?`;
    connection.query(query, [department_Id] ,(error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }

      if (results.length === 0) {
        const error = new Error('Teachers not found');
        callback(error);
        return;
      }

      const teacherslist = results.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        lastname: teacher.lastname,
        email: teacher.email,
        departmentCode: teacher.departmentCode,

      }),);
      callback(null, { teacherslist });
    });
  },
};

const server = new grpc.Server();
server.addService(departmentServiceDefinition.service, departmentService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`Movie microservice running on port ${port}`);