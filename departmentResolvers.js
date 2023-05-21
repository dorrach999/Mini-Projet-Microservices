// resolvers.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger le fichier proto pour le département et l'enseignant
const departmentProtoPath = 'department.proto';

const departmentProtoDefinition = protoLoader.loadSync(departmentProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});


const departmentProto = grpc.loadPackageDefinition(departmentProtoDefinition);
//const departmentProto = grpc.loadPackageDefinition(departmentProtoDefinition).department;

// Définir les résolveurs pour les requêtes GraphQL
const departmentResolvers = {
  Query: {
    department: (_, { id }) => {
      // Effectuer un appel gRPC au microservice de départements
      const client = new departmentProto.DepartmentService('localhost:50051',
        grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.FindDepartment({ department_id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.department);
          }
        });
      });
    },
    departments: () => {
      // Effectuer un appel gRPC au microservice de départements
      const client = new departmentProto.DepartmentService('localhost:50051',
        grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.GetDepartments({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.departments);
          }
        });
      });
    },
    teacherslist: (_, { departmentCode}) => {
      const client = new departmentProto.DepartmentService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.GetTeachersByDepartment({ departmentId: departmentCode }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.teacherslist);
          }
        });
      });
    }
  },
  Mutation: {
    createDepartment: (_, { name }) => {
      return new Promise((resolve, reject) => {
        const client = new departmentProto.DepartmentService('localhost:50051',
          grpc.credentials.createInsecure());
        client.CreateDepartment({ name: name }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.department);
          }
        });
      });
    },
    updateDepartment: (_, { id, name }) => {
        return new Promise((resolve, reject) => {
        const client = new departmentProto.DepartmentService('localhost:50051',
            grpc.credentials.createInsecure());
        const request = {
          dep_id: id,
            name: name,
        };
        client.UpdateDepartment(request, (err, response) => {
            if (err) {
            reject(err);
            } else {
            resolve(response.department);
            }
        });
        });
    },
    deleteDepartment: (_, { id }) => {
        return new Promise((resolve, reject) => {
          const client = new departmentProto.DepartmentService('localhost:50051',
            grpc.credentials.createInsecure());
          const request = {
            department_id: id,
          };
          client.DeleteDepartment(request, (err, response) => {
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
module.exports = departmentResolvers;
      
      
      
      
      
      
    

