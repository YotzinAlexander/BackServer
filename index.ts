import Server from './classes/server';
import router from './routes/router';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import grupoRoutes from './routes/grupo';
import mensajeRoutes from './routes/mensajes';
import fileUpload from 'express-fileupload';
import reporteRoutes from './routes/reportes';


const server = Server.instance;

// BodyParser
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

// File Upload
server.app.use(fileUpload({useTempFiles: true}));

// CORS
server.app.use(cors({origin: true, credentials: true}));

// Rutas de Servicios
server.app.use('/', router, userRoutes, grupoRoutes, mensajeRoutes, reporteRoutes);

// Conectar Base de datos
mongoose.connect('mongodb://localhost:27017/chat', {useNewUrlParser: true, useCreateIndex: true}, (err) => {
    if ( err ) throw err;

    console.log('Base de datos ONLINE');
})

// levantar server
server.start();
