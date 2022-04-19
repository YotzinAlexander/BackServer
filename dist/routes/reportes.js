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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middelwares/autenticacion");
const reportes_model_1 = require("../models/reportes.model");
const reporteRoutes = express_1.Router();
reporteRoutes.get('/obtener/reportes', autenticacion_1.verificaToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield reportes_model_1.Reporte.find({}).sort({ $natural: -1 }).then(reporteDB => {
        res.json({
            ok: true,
            reporte: reporteDB
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
}));
reporteRoutes.get('/obtener/reporte/:filtro', autenticacion_1.verificaToken, (req, res) => {
    const filtro = req.params.filtro;
    console.log(filtro);
    reportes_model_1.Reporte.find({ 'motivo': { '$regex': filtro, '$options': 'i' } }).then(reporteBD => {
        res.json({
            ok: true,
            reporte: reporteBD
        });
    });
});
reporteRoutes.post('/bloqueo/reportes', autenticacion_1.verificaToken, (req, res) => {
    reportes_model_1.Reporte.deleteOne({ _id: req.body._id }, (reporteDB) => __awaiter(void 0, void 0, void 0, function* () {
        if (!reporteDB) {
            return res.json({
                ok: false,
                mensaje: 'NO existe un reporte con ese ID ' + req.body._id
            });
        }
        yield res.json({
            ok: true,
            reporte: reporteDB
        });
    }));
});
exports.default = reporteRoutes;
