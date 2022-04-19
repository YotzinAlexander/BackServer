import { Router, Response } from 'express';
import { Mensaje } from '../models/mensaje.model';
import { verificaToken } from '../middelwares/autenticacion';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';
import { mensaje } from '../sockets/sockets';

const mensajeRoutes = Router();
const fileSystem = new FileSystem();

mensajeRoutes.get('/mensajes/:grupo/:img', (req: any, res: Response) => {

    const grupo = req.params.grupo;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoUrl(grupo, img);

    res.sendFile( pathFoto );
});

mensajeRoutes.post('/mensajes',  (req: any, res: Response) => {

    const grupo = req.body.grupo;

    // console.log(grupo);

    const skip = Mensaje.find({grupo: grupo}).skip(50);

            skip.countDocuments().then( async count => {
                // console.log(count);

                if (count < 0) {
                    Mensaje.find({grupo: grupo}).sort({$natural: 1}).limit(50)
                        .populate('usuario', '-password')
                        .populate('grupo')
                        .populate({path: 'responder', populate:{path: 'usuario'}})
                        .then( mensajesDB => {

                            res.json({

                                ok: true,
                                mensajes: mensajesDB

                            });
                            
                        }).catch( err => {
                            res.json({

                                ok: false,
                                err

                            });
                    });

                } else {

                    await Mensaje.find({grupo: grupo}).sort({$natural: 1}).limit(50).skip(count)
                            .populate('usuario', '-password')
                            .populate('grupo')
                            .populate({path: 'responder', populate:{path: 'usuario'}})
                            .then( mensajesDB => {

                                res.json({

                                    ok: true,
                                    mensajes: mensajesDB

                                });
                            }).catch( err => {
                                res.json({

                                    ok: false,
                                    err

                        });
                    });
                }

                
            });
});

mensajeRoutes.post('/mensajes/upload', verificaToken, async (req: any, res: Response) => {

    // console.log(req.body.grupo);
    //console.log(req.);

    if ( !req.files ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }

    const file: FileUpload = req.files.image;

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

    await fileSystem.guardarImagenTeporal(file, req.usuario._id);

    res.json({
        ok: true,
        file : file.mimetype
    });
});


mensajeRoutes.post('/mensajes/upload/file', verificaToken, async (req: any, res: Response) => {
    
    if ( !req.files ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo no llegon nada'
        });
    }

    const file: FileUpload = req.files.file;


    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo - file'
        });
    }

    console.log('FILEEEEEEEEEEEEEEEEE ---- '+ file.name);

    Mensaje.find({"doc" : [file.name]}).then(async mensajesBD =>{
      //  console.log(mensajesBD.length);

        if(mensajesBD.length === 0){

            await fileSystem.guardarArchivoenTemporales(file, req.usuario._id);

            res.json({
                ok: true,
                file : file.mimetype
            });

        } else {
            return res.status(400).json({
                ok: false,
                mensaje: 'Archivo existenste'
            });

        }
    })
    

});


///////////////////////////////////////////////////////////
//////////////////// RUTAS NUEVAS /////////////////////////
///////////////////////////////////////////////////////////

mensajeRoutes.get('/obtener/mensaje/:id', verificaToken, (req: any, res: Response) => {

    const _id = req.params.id

    Mensaje.find({_id}).then( mensajeDB => {
        res.json({
            ok: true,
            mensaje: mensajeDB
        });
    });
});

mensajeRoutes.get('/eliminado/:id/:grupo', verificaToken, (req: any, res: Response) => {

    const _id = req.params.id;
    const grupo = req.params.grupo;

    const mensaje = {
        eliminar: true
    }

    Mensaje.findByIdAndUpdate( _id, mensaje, {new: true}, (err, mensajeDB) => {
     //   console.log(mensajeDB);
    });

    // console.log(grupo);

    const skip = Mensaje.find({grupo: grupo}).skip(50);

            skip.countDocuments().then( async count => {
                // console.log(count);

                if (count < 0) {
                    Mensaje.find({grupo: grupo}).sort({$natural: 1}).limit(50)
                        .populate('usuario', '-password')
                        .populate('grupo')
                        .populate({path: 'responder', populate:{path: 'usuario'}})
                        .then( mensajesDB => {

                            res.json({

                                ok: true,
                                mensajes: mensajesDB

                            });
                            
                        }).catch( err => {
                            res.json({

                                ok: false,
                                err

                            });
                    });

                } else {

                    await Mensaje.find({grupo: grupo}).sort({$natural: 1}).limit(50).skip(count)
                            .populate('usuario', '-password')
                            .populate('grupo')
                            .populate({path: 'responder', populate:{path: 'usuario'}})
                            .then( mensajesDB => {

                                res.json({

                                    ok: true,
                                    mensajes: mensajesDB

                                });
                            }).catch( err => {
                                res.json({

                                    ok: false,
                                    err

                        });
                    });
                }

                
            });
});

export default mensajeRoutes;