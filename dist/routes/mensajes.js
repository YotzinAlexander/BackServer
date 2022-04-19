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
const express_1 = require("express");
const mensaje_model_1 = require("../models/mensaje.model");
const autenticacion_1 = require("../middelwares/autenticacion");
const file_system_1 = __importDefault(require("../classes/file-system"));
const mensajeRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
mensajeRoutes.get('/mensajes/:grupo/:img', (req, res) => {
    const grupo = req.params.grupo;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(grupo, img);
    res.sendFile(pathFoto);
});
mensajeRoutes.post('/mensajes', (req, res) => {
    const grupo = req.body.grupo;
    // console.log(grupo);
    const skip = mensaje_model_1.Mensaje.find({ grupo: grupo }).skip(50);
    skip.countDocuments().then((count) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(count);
        if (count < 0) {
            mensaje_model_1.Mensaje.find({ grupo: grupo }).sort({ $natural: 1 }).limit(50)
                .populate('usuario', '-password')
                .populate('grupo')
                .populate({ path: 'responder', populate: { path: 'usuario' } })
                .then(mensajesDB => {
                res.json({
                    ok: true,
                    mensajes: mensajesDB
                });
            }).catch(err => {
                res.json({
                    ok: false,
                    err
                });
            });
        }
        else {
            yield mensaje_model_1.Mensaje.find({ grupo: grupo }).sort({ $natural: 1 }).limit(50).skip(count)
                .populate('usuario', '-password')
                .populate('grupo')
                .populate({ path: 'responder', populate: { path: 'usuario' } })
                .then(mensajesDB => {
                res.json({
                    ok: true,
                    mensajes: mensajesDB
                });
            }).catch(err => {
                res.json({
                    ok: false,
                    err
                });
            });
        }
    }));
});
mensajeRoutes.post('/mensajes/upload', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body.grupo);
    //console.log(req.);
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo - image'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que subio no es una imagen'
        });
    }
    yield fileSystem.guardarImagenTeporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
mensajeRoutes.post('/mensajes/upload/file', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo no llegon nada'
        });
    }
    const file = req.files.file;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo - file'
        });
    }
    console.log('FILEEEEEEEEEEEEEEEEE ---- ' + file.name);
    mensaje_model_1.Mensaje.find({ "doc": [file.name] }).then((mensajesBD) => __awaiter(void 0, void 0, void 0, function* () {
        //  console.log(mensajesBD.length);
        if (mensajesBD.length === 0) {
            yield fileSystem.guardarArchivoenTemporales(file, req.usuario._id);
            res.json({
                ok: true,
                file: file.mimetype
            });
        }
        else {
            return res.status(400).json({
                ok: false,
                mensaje: 'Archivo existenste'
            });
        }
    }));
}));
///////////////////////////////////////////////////////////
//////////////////// RUTAS NUEVAS /////////////////////////
///////////////////////////////////////////////////////////
mensajeRoutes.get('/obtener/mensaje/:id', autenticacion_1.verificaToken, (req, res) => {
    const _id = req.params.id;
    mensaje_model_1.Mensaje.find({ _id }).then(mensajeDB => {
        res.json({
            ok: true,
            mensaje: mensajeDB
        });
    });
});
mensajeRoutes.get('/eliminado/:id/:grupo', autenticacion_1.verificaToken, (req, res) => {
    const _id = req.params.id;
    const grupo = req.params.grupo;
    const mensaje = {
        eliminar: true
    };
    mensaje_model_1.Mensaje.findByIdAndUpdate(_id, mensaje, { new: true }, (err, mensajeDB) => {
        //   console.log(mensajeDB);
    });
    // console.log(grupo);
    const skip = mensaje_model_1.Mensaje.find({ grupo: grupo }).skip(50);
    skip.countDocuments().then((count) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(count);
        if (count < 0) {
            mensaje_model_1.Mensaje.find({ grupo: grupo }).sort({ $natural: 1 }).limit(50)
                .populate('usuario', '-password')
                .populate('grupo')
                .populate({ path: 'responder', populate: { path: 'usuario' } })
                .then(mensajesDB => {
                res.json({
                    ok: true,
                    mensajes: mensajesDB
                });
            }).catch(err => {
                res.json({
                    ok: false,
                    err
                });
            });
        }
        else {
            yield mensaje_model_1.Mensaje.find({ grupo: grupo }).sort({ $natural: 1 }).limit(50).skip(count)
                .populate('usuario', '-password')
                .populate('grupo')
                .populate({ path: 'responder', populate: { path: 'usuario' } })
                .then(mensajesDB => {
                res.json({
                    ok: true,
                    mensajes: mensajesDB
                });
            }).catch(err => {
                res.json({
                    ok: false,
                    err
                });
            });
        }
    }));
});
exports.default = mensajeRoutes;
