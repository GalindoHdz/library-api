// Modules
import express from 'express';
import morgan from 'morgan';
import file_upload from 'express-fileupload';
import cors from 'cors';
import routes from './routes';
import graphql from './graphql';
import { config } from 'dotenv';
import { Connect } from './utils/database';

// Environment variables
config();

// Connection to the database
Connect();

// Initialization and configuration of the application
const app = express();
app.set('port', process.env.PORT);

// Middelwares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(file_upload({ createParentPath: true, tempFileDir: '/tmp/' }));
app.use(routes);
graphql.applyMiddleware({ app });

// Starting the server
app.listen(app.get('port'), () => {
  console.log(`Server on port => ${app.get('port')}`);
});
