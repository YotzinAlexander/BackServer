"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get('/mensajes', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'Todo esta bien'
    });
});
// router.post('/mensajes', (req: Request, res: Response) => {
//     const cuerpo = req.body.cuerpo;
//     const de = req.body.de;
//     res.json({
//         ok: true,
//         cuerpo,
//         de,
//         mensaje: 'POST - Listo'
//     });
// });
// router.post('/mensajes/:id', (req: Request, res: Response) => {
//     const cuerpo = req.body.cuerpo;
//     const de = req.body.de;
//     const id = req.params.id;
//     res.json({
//         ok: true,
//         cuerpo,
//         de,
//         id,
//         mensaje: 'POST - Listo'
//     });
// });
exports.default = router;
