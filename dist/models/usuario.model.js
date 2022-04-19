"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const usuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre es necesario']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    corporacion: {
        type: String
    },
    grupos: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Grupos',
            required: [true, 'Debe existir una referencia a un grupo']
        }],
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    enabled: {
        type: Boolean,
        default: true
    }, onesignal: {
        type: String
    }, uType: {
        type: String
    }
});
usuarioSchema.method('compararPassword', function (password = '') {
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
usuarioSchema.method('compararMail', function (email = '') {
    if (email === this.email) {
        return true;
    }
    else {
        return false;
    }
});
exports.Usuario = mongoose_1.model('Usuario', usuarioSchema);
