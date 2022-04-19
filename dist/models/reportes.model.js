"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reportesSchema = new mongoose_1.Schema({
    folio: {
        type: String
    },
    fecha: {
        type: String
    },
    hora: {
        type: String
    },
    motivo: {
        type: String
    },
    descripcion: {
        type: String
    },
    coord_x: {
        type: String
    },
    coord_y: {
        type: String
    },
    enchat: {
        type: Boolean,
        default: false
    }
});
exports.Reporte = mongoose_1.model('Reporte', reportesSchema);
