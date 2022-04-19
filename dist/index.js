"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const router_1 = __importDefault(require("./routes/router"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const grupo_1 = __importDefault(require("./routes/grupo"));
const mensajes_1 = __importDefault(require("./routes/mensajes"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const reportes_1 = __importDefault(require("./routes/reportes"));
const server = server_1.default.instance;
// BodyParser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// File Upload
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
// CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
// Rutas de Servicios
server.app.use('/', router_1.default, usuario_1.default, grupo_1.default, mensajes_1.default, reportes_1.default);
// Conectar Base de datos
mongoose_1.default.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('Base de datos ONLINE');
});
// levantar server
server.start();
