"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const environment_1 = require("../global/environment");
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const socket = __importStar(require("../sockets/sockets"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.port = environment_1.SERVER_PORT;
        this.httpServer = new http_1.default.Server(this.app);
        this.io = socket_io_1.default(this.httpServer);
        this.escucharSockets();
    }
    escucharSockets() {
        console.log('Escuchando conexiones - Sockets');
        this.io.on('connection', cliente => {
            console.log('Cliente conectado');
            //mensajes
            socket.mensaje(cliente, this.io);
            // desconectar
            socket.desconectar(cliente);
            // mensajes viejos
            socket.mensajesViejos(cliente, this.io);
            // escribiendo
            socket.escribiendo(cliente, this.io);
            //devolviendo mensaje on imagen
            socket.imagen(cliente, this.io);
            //mensaje de respuesta
            socket.respuesta(cliente, this.io);
            //reenvio de mensajes
            socket.reenviar(cliente, this.io);
        });
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    start() {
        this.httpServer.listen(this.port, () => console.log(`Servidor Corriendo en el puerto ${this.port}`));
    }
}
exports.default = Server;
