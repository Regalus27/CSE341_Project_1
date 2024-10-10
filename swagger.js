const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
        title: 'My API',
        description: 'CSE341 W03-W04 Project API'
    },
    host: 'cse341-project-1-p1v7.onrender.com',
    schemes: ['https']
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);