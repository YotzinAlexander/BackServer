"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const grupoSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre es necesario'],
        unique: true
    },
    img: {
        type: String,
        default: 'grupo.png'
    },
    enabled: {
        type: Boolean,
        default: true
    }
});
exports.Grupos = mongoose_1.model('Grupos', grupoSchema);
