import {Router, Request, Response } from 'express';

const router = Router();

router.get('/mensajes', (req: Request, res: Response) => {
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

export default router;