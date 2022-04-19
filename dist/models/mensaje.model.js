"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mensajeSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    texto: {
        type: String
    },
    img: [{
            type: String
        }],
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir una referencia a un usuario']
    },
    grupo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Grupos',
        required: [true, 'Debe existir una referencia a un grupo']
    },
    responder: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Mensaje',
    },
    reenviar: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    eliminar: {
        type: Boolean,
        default: false
    },
    doc: [{
            type: String
        }]
});
mensajeSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Mensaje = mongoose_1.model('Mensaje', mensajeSchema);
