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

const teacherProtoPath = 'teacher.proto';
const teacherProtoDefinition = protoLoader.loadSync(teacherProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const teacherPackageDefinition = grpc.loadPackageDefinition(teacherProtoDefinition);
const teacherService = teacherPackageDefinition.TeacherService;

const teacherMethods = {
  findTeacher: (call, callback) => {
    const teacherId = call.request.teacher_id;
    const query = 'SELECT * FROM teachers WHERE id = ?';

    connection.query(query, [teacherId], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }

      if (results.length === 0) {
        const error = new Error('Teacher not found');
        callback(error);
        return;
      }

      const teacher = results[0];
      callback(null, {
        teacher: {
          id: teacher.id,
          name: teacher.name,
          lastname: teacher.lastname,
          email: teacher.email,
          departmentCode: teacher.departmentCode,
        },
      });
    });
  },

  getTeachers: (call, callback) => {
    const query = `SELECT * FROM teachers`;
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }

      const teachers = results.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        lastname: teacher.lastname,
        email: teacher.email,
        departmentCode:teacher.departmentCode,
        
      }),);
      callback(null, { teachers });
    });
  },
  createTeacher: (call, callback) => {
    const { name,lastname,email,departmentCode} = call.request;

    connection.query(
      'INSERT INTO teachers (name,lastname,email,departmentCode) VALUES (?,?,?,?)',
      [name,lastname,email,departmentCode],
      (error, result) => {
        if (error) {
          console.error(error);
          callback(error);
          return;
        }

        callback(null, {
          teacher: {
            id: result.insertId,
            name,
            lastname,
            email,
            departmentCode,
          },
        });
      }
    );
  },

  deleteTeacher: (call, callback) => {
    const teacherId = call.request.teacher_id;
    const query = 'DELETE FROM teachers WHERE id = ?';

    connection.query(query, [teacherId], (error, result) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }

      callback(null, { success: true });
    });
  },

  updateTeacher: (call, callback) => {
    const { teacher_id, name ,lastname,email,departmentCode} = call.request;
    const query = 'UPDATE teachers SET name = ? , lastname = ? , email = ? ,departmentCode = ? WHERE id = ?';

    connection.query(query, [name,lastname,email,departmentCode, teacher_id], (error, result) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }

      callback(null, {
        teacher: {
          id: teacher_id,
          name,
          lastname,
          email,
          departmentCode,
        },
      });
    });
  },
};

const server = new grpc.Server();
server.addService(teacherService.service, teacherMethods);

const port = 50054;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }
  console.log(`Server is running on port ${port}`);
  server.start();
});

console.log(`Teacher microservice running on port ${port}`);