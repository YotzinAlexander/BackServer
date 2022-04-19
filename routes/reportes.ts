import { Router, Request, Response } from 'express';
import Token from '../classes/token';
import { verificaToken } from '../middelwares/autenticacion';
import { Reporte } from '../models/reportes.model';


const reporteRoutes = Router();

reporteRoutes.get('/obtener/reportes', verificaToken, async (req: any, res: Response) => {

    await Reporte.find({}).sort({$natural: -1}).then( reporteDB => {
 
         res.json({
             ok: true,
             reporte: reporteDB
         });
     }).catch( err => {
         res.json({
             ok: false,
             err
         });
     });
 });

 reporteRoutes.get('/obtener/reporte/:filtro', verificaToken, (req: Request, res: Response) => {

    const filtro = req.params.filtro;
    console.log(filtro);
    Reporte.find({'motivo': {'$regex': filtro, '$options':'i'}}).then(reporteBD => {

        res.json({
            ok: true,
            reporte: reporteBD
        });
    });
});

reporteRoutes.post('/bloqueo/reportes', verificaToken, (req: Request, res: Response) => {

    Reporte.deleteOne( { _id: req.body._id },  async (reporteDB) => {

        if (!reporteDB) {
            return res.json({
                ok: false,
                mensaje: 'NO existe un reporte con ese ID ' + req.body._id
            });
        }
         
         await res.json({
             ok:true,
             reporte: reporteDB
         });

    })
});

 export default reporteRoutes;