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
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middelwares/autenticacion");
const grupos_model_1 = require("../models/grupos.model");
const userRoutes = express_1.Router();
userRoutes.post('/checkUserType', (req, res) => {
    const body = req.body;
    // console.log(body.email);
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        console.log(body.email);
        // solo verifica si el correo es erroneo
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario1 '
            });
        }
        if (userDB.compararMail(body.email)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                avatar: userDB.avatar,
                email: userDB.email,
                corporacion: userDB.corporacion,
                grupos: userDB.grupos,
                uType: userDB.uType
            });
            if (userDB.uType === '01') {
                res.json({
                    ok: true
                });
            }
            else {
                return res.json({
                    ok: false,
                    mensaje: ' no son correctos'
                });
            }
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario2'
            });
        }
    });
});
// Login
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        // solo verifica si el correo es erroneo
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos'
            });
        }
        if (userDB.compararPassword(body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                avatar: userDB.avatar,
                email: userDB.email,
                corporacion: userDB.corporacion,
                grupos: userDB.grupos,
                uType: userDB.uType
            });
            res.json({
                ok: true,
                token: tokenUser,
                uType: userDB.uType
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos'
            });
        }
    });
});
// Crear Usuarios
userRoutes.post('/create/usuario', autenticacion_1.verificaToken, (req, res) => {
    const usuario = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        grupos: req.body.grupos,
        corporacion: req.body.corporacion,
        uType: req.body.uType
    };
    usuario_model_1.Usuario.create(usuario).then((userDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield userDB.populate('grupos').execPopulate();
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            avatar: userDB.avatar,
            email: userDB.email,
            corporacion: userDB.corporacion,
            grupos: userDB.grupos,
            uType: req.body.uType
        });
        res.json({
            ok: true,
            mensaje: 'El usuario se creo con exito'
        });
    })).catch(err => {
        res.json({
            err,
            mensaje: 'no se pudo crear el usuario'
        });
    });
});
// Actualizar usaurio
userRoutes.post('/update', autenticacion_1.verificaToken, (req, res) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        grupos: req.body.grupos || req.usuario.grupos,
        corporacion: req.body.corporacion || req.usuario.corporacion
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.body._id, user, { new: true }, (err, userDB) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'NO existe un ususario con ese ID'
            });
        }
        yield userDB.populate('grupos').execPopulate();
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            avatar: userDB.avatar,
            email: userDB.email,
            corporacion: userDB.corporacion,
            grupos: userDB.grupos
        });
        res.json({
            ok: true,
            usuario: userDB
        });
    }));
});
userRoutes.get('/token', autenticacion_1.verificaToken, (req, res) => {
    const usuarioToken = req.usuario;
    console.log(usuarioToken);
    usuario_model_1.Usuario.findById(usuarioToken._id, (err, userDB) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'NO existe un ususario con ese ID'
            });
        }
        yield userDB.populate('grupos').execPopulate();
        res.json({
            ok: true,
            userDB
        });
    }));
});
userRoutes.post('/grupos/usuario', (req, res) => {
    const email = req.body.email;
    usuario_model_1.Usuario.findOne({ email: email }, (err, userDB) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'El correo electronico no se encuentra en la base de datos'
            });
        }
        yield userDB.populate('grupos').execPopulate();
        const usuario = {
            email: userDB.email,
            grupos: userDB.grupos
        };
        res.json({
            ok: true,
            usuario
        });
    }));
});
userRoutes.get('/grupos', autenticacion_1.verificaToken, (req, res) => {
    grupos_model_1.Grupos.find().then(gruposDB => {
        res.json({
            ok: true,
            grupos: gruposDB
        });
    });
});
///////////////////////////////////////////////////////////
//////////////////// RUTAS NUEVAS /////////////////////////
///////////////////////////////////////////////////////////
userRoutes.get('/obtener/usuarios', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield usuario_model_1.Usuario.find({}, { password: 0 }) /*.populate('grupos')*/.then(usuarioDB => {
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
}));
userRoutes.get('/obtener/usuarios/:filtro', autenticacion_1.verificaToken, (req, res) => {
    const filtro = req.params.filtro;
    console.log(filtro);
    usuario_model_1.Usuario.find({ 'nombre': { '$regex': filtro, '$options': 'i' } }).then(usuarioDB => {
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});
userRoutes.post('/bloqueo/usuario', autenticacion_1.verificaToken, (req, res) => {
    const usuario = {
        enabled: req.body.enable,
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.body._id, usuario, { new: true }, (err, usuarioDB) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        if (!usuarioDB) {
            return res.json({
                ok: false,
                mensaje: 'NO existe un ususario con ese ID'
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    }));
});
exports.default = userRoutes;
