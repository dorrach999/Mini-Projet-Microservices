// resolvers.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger le fichier proto pour le département et l'enseignant
const teacherProtoPath = 'teacher.proto';


const teacherProtoDefinition = protoLoader.loadSync(teacherProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const teacherProto = grpc.loadPackageDefinition(teacherProtoDefinition);

// Définir les résolveurs pour les requêtes GraphQL
const  teacherResolvers = {
  Query: {
    teacher: (_, { id }) => {
      // Effectuer un appel gRPC au microservice d'enseignants
      const client = new teacherProto.TeacherService('localhost:50054',
        grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.FindTeacher({ teacher_id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.teacher);
          }
        });
      });
    },
    teachers: () => {
      // Effectuer un appel gRPC au microservice d'enseignants
      const client = new teacherProto.TeacherService('localhost:50054',
        grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.GetTeachers({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.teachers);
          }
        });
      });
    },
  },
  Mutation: {
    createTeacher: (_, { name, lastname, email,departmentCode}) => {
        return new Promise((resolve, reject) => {
          const client = new teacherProto.TeacherService('localhost:50054',
            grpc.credentials.createInsecure());
          const request = {
            name: name,
            lastname: lastname,
            email: email,
            departmentCode: departmentCode,
          };
          client.CreateTeacher(request, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.teacher);
            }
          });
        });
      },
    updateTeacher: (_, { id, name, lastname,departmentCode}) => {
        return new Promise((resolve, reject) => {
        const client = new teacherProto.TeacherService('localhost:50054',
            grpc.credentials.createInsecure());
        const request = {
            teacher_id: id,
            name: name,
            lastname: lastname,
            email: email,
            departmentCode: departmentCode,
            //departmentId: departmentId,
        };
        client.UpdateTeacher(request, (err, response) => {
            if (err) {
            reject(err);
            } else {
            resolve(response.teacher);
            }
        });
        });
    },
    deleteTeacher: (_, { id }) => {
        return new Promise((resolve, reject) => {
          const client = new teacherProto.TeacherService('localhost:50054',
            grpc.credentials.createInsecure());
          const request = {
            teacher_id: id,
          };
          client.DeleteTeacher(request, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.success);
            }
          });
        });
    },
}
};
module.exports = teacherResolvers;
      
      
      
      
      
      
    

