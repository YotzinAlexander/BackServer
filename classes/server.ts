import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/sockets';

export default class Server {

    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;

    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        
        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);

        this.escucharSockets();

    }

    private escucharSockets() {
        console.log('Escuchando conexiones - Sockets');

        this.io.on('connection', cliente => {

            console.log('Cliente conectado');

            //mensajes
            socket.mensaje( cliente, this.io );

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

    public static get instance() {
        return this._instance || ( this._instance = new this());
    }

    start() {
        this.httpServer.listen( this.port, () => console.log(`Servidor Corriendo en el puerto ${this.port}`));
    }
}