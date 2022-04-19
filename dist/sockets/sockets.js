"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mensaje_model_1 = require("../models/mensaje.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
let grupo;
const fileSystem = new file_system_1.default();
exports.desconectar = (cliente) => {
    cliente.on('disconnect', () => {
        console.log('Cliente Desconectado');
    });
};
// Escuchar mensajes
exports.mensaje = (cliente, io) => {
    cliente.on('mensaje', (payload) => {
        grupo = payload.grupo;
        cliente.join(payload.grupo);
        const mensaje = {
            texto: payload.texto,
            usuario: payload._id,
            grupo: payload.grupo
        };
        mensaje_model_1.Mensaje.create(mensaje).then((mensajeDB) => __awaiter(void 0, void 0, void 0, function* () {
            yield mensajeDB.populate('grupo').execPopulate();
            yield mensajeDB.populate('usuario', '-password').execPopulate();
            yield mensajeDB.populate({ path: 'responder', populate: { path: 'usuario' } }).execPopulate();
            // console.log('Mensaje recibido', payload);
            io.emit('mensaje-nuevo', mensajeDB);
        }));
    });
};
exports.mensajesViejos = (cliente, io) => {
    cliente.on('mensajes-v', (payload) => {
        cliente.join(payload.grupo);
        grupo = payload.grupo;
        console.log(grupo);
        // const skip = Mensaje.find({grupo: grupo}).skip(50);
        // const contar = skip.countDocuments().then( count => {
        //     console.log(count);
        //     if (count < 0) {
        //         Mensaje.find({grupo: grupo}).sort({$natural: 1}).limit(50).populate('usuario').populate('grupo').then( mensajesDB => {
        //             io.emit('mensajes-viejos', mensajesDB);
        //         });
        //     } else {
        //         Mensaje.find({grupo: grupo}).sort({$natural: 1}).limit(50).skip(count).populate('usuario').populate('grupo').then( mensajesDB => {
        //             io.to(grupo).emit('mensajes-viejos', mensajesDB);
        //         });
        //     }
        // });
    });
};
exports.escribiendo = (cliente, io) => {
    cliente.on('escribiendo', (payload) => {
        grupo = payload.grupo;
        io.emit('escribiendo', grupo);
    });
};
exports.imagen = (cliente, io) => {
    cliente.on('imagen', (payload) => {
        const _id = payload._id;
        const grupo = payload.grupo;
        const file = fileSystem.imagenesDeTempHaciaMensajes(_id);
        const extension = file.toString().substr(-3);
        // Validacion para envio de archivo PDF O IMAGEN!! *****************************
        if (extension === 'pdf') {
            const mensaje = {
                usuario: _id,
                grupo: grupo,
                doc: file
            };
            mensaje_model_1.Mensaje.create(mensaje).then((mensajeDB) => __awaiter(void 0, void 0, void 0, function* () {
                yield mensajeDB.populate('grupo').execPopulate();
                yield mensajeDB.populate('usuario', '-password').execPopulate();
                yield mensajeDB.populate({ path: 'responder', populate: { path: 'usuario' } }).execPopulate();
                io.emit('mensaje-nuevo', mensajeDB);
            }));
        }
        else {
            const mensaje = {
                usuario: _id,
                grupo: grupo,
                img: file
            };
            mensaje_model_1.Mensaje.create(mensaje).then((mensajeDB) => __awaiter(void 0, void 0, void 0, function* () {
                yield mensajeDB.populate('grupo').execPopulate();
                yield mensajeDB.populate('usuario', '-password').execPopulate();
                yield mensajeDB.populate({ path: 'responder', populate: { path: 'usuario' } }).execPopulate();
                // console.log('Mensaje recibido', payload);
                io.emit('mensaje-nuevo', mensajeDB);
            }));
        }
    });
};
////////////////////////////////////////////////////////////
////////////////////// NUVEOS SOCKETS //////////////////////
////////////////////////////////////////////////////////////
exports.respuesta = (cliente, io) => {
    cliente.on('respuesta', (payload) => {
        const _id = payload._id;
        const idRes = payload.idRes;
        const respuesta = payload.respuesta;
        const grupo = payload.grupo;
        const mensaje = {
            usuario: _id,
            grupo: grupo,
            responder: idRes,
            texto: respuesta
        };
        mensaje_model_1.Mensaje.create(mensaje).then((mensajeDB) => __awaiter(void 0, void 0, void 0, function* () {
            yield mensajeDB.populate('grupo').execPopulate();
            yield mensajeDB.populate('usuario', '-password').execPopulate();
            yield mensajeDB.populate({ path: 'responder', populate: { path: 'usuario' } }).execPopulate();
            io.emit('mensaje-nuevo', mensajeDB);
        }));
    });
};
exports.reenviar = (cliente, io) => {
    cliente.on('reenviar', (payload) => {
        const _id = payload._id;
        const texto = payload.texto;
        const img = payload.img;
        const doc = payload.doc;
        const reenviar = payload.reenviar;
        const grupo = payload.grupo;
        const mensaje = {
            usuario: _id,
            texto,
            img,
            doc,
            reenviar,
            grupo
        };
        mensaje_model_1.Mensaje.create(mensaje).then((mensajeDB) => __awaiter(void 0, void 0, void 0, function* () {
            yield mensajeDB.populate('grupo').execPopulate();
            yield mensajeDB.populate('usuario', '-password').execPopulate();
            io.emit('mensaje-nuevo', mensajeDB);
        }));
    });
};
