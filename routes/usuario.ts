import { Router, Request, Response } from 'express';
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verificaToken } from '../middelwares/autenticacion';
import { Grupos } from '../models/grupos.model';


const userRoutes = Router();

userRoutes.post('/checkUserType', (req : Request, res: Response)=> {
    const body = req.body;
   // console.log(body.email);
Usuario.findOne({email: body.email}, (err, userDB) => {

    console.log(body.email);
    // solo verifica si el correo es erroneo
    if(err) throw err;

    if (!userDB) {
            
        return res.json({
            ok: false,
            mensaje: 'Usuario1 '
        });
    }


    if (userDB.compararMail(body.email)) {

        const tokenUser = Token.getJwtToken({
           _id: userDB._id,
           nombre: userDB.nombre,
           avatar: userDB.avatar,
           email: userDB.email,
           corporacion: userDB.corporacion,
           grupos: userDB.grupos,
           uType: userDB.uType
        })

        if(userDB.uType === '01'){
            
            res.json({
                ok:true
            }); 
        }else {
            return res.json({
                ok: false,
                mensaje: ' no son correctos'
            });
        }
        
        

    } else{

        return res.json({
            ok: false,
            mensaje: 'Usuario2'
        });
    }

})
    
});

// Login
userRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;

    Usuario.findOne({ email: body.email }, (err, userDB) => {

// solo verifica si el correo es erroneo
        if(err) throw err;

        if (!userDB) {
            
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos'
            });
        }

        if (userDB.compararPassword(body.password)) {

            const tokenUser = Token.getJwtToken({
               _id: userDB._id,
               nombre: userDB.nombre,
               avatar: userDB.avatar,
               email: userDB.email,
               corporacion: userDB.corporacion,
               grupos: userDB.grupos,
               uType: userDB.uType
            })
            
            res.json({
                ok:true,
                token: tokenUser,
                uType:  userDB.uType
            });

        } else{

            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos'
            });
        }
    });
});

// Crear Usuarios
userRoutes.post('/create/usuario', verificaToken, (req: Request, res: Response) => {

    const usuario = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        grupos: req.body.grupos,
        corporacion:req.body.corporacion,
        uType: req.body.uType
    }


    Usuario.create(usuario).then( async userDB => {

        await userDB.populate('grupos').execPopulate();

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            avatar: userDB.avatar,
            email: userDB.email,
            corporacion: userDB.corporacion,
            grupos: userDB.grupos,
            uType: req.body.uType
         });
         
         res.json({
             ok:true,
             mensaje: 'El usuario se creo con exito'
         });

    }).catch( err => {
        res.json({
            err,
            mensaje: 'no se pudo crear el usuario'
        });
    });
    
});

// Actualizar usaurio
userRoutes.post('/update', verificaToken, (req: any, res: Response) => {

    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        grupos: req.body.grupos || req.usuario.grupos,
        corporacion:req.body.corporacion || req.usuario.corporacion
    };

    Usuario.findByIdAndUpdate( req.body._id, user, {new: true}, async (err, userDB) => {

        if(err) throw err;

        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'NO existe un ususario con ese ID'
            });
        }

        await userDB.populate('grupos').execPopulate();

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            avatar: userDB.avatar,
            email: userDB.email,
            corporacion: userDB.corporacion,
            grupos: userDB.grupos
         });
         
         res.json({
             ok:true,
             usuario: userDB
         });

    })
});

userRoutes.get('/token', verificaToken, (req: any, res: Response) => {
    const usuarioToken = req.usuario;
    console.log(usuarioToken);
    Usuario.findById(usuarioToken._id, async ( err, userDB) => {

        if(err) throw err;

        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'NO existe un ususario con ese ID'
            });
        }

        await userDB.populate('grupos').execPopulate();

        res.json({
            ok: true,
            userDB
        })
    });

    
})

userRoutes.post('/grupos/usuario', (req: any, res: Response) => {

    const email = req.body.email;

    Usuario.findOne({ email: email}, async (err, userDB) => {
        if(err) throw err;

        if (!userDB) {
            
            return res.json({
                ok: false,
                mensaje: 'El correo electronico no se encuentra en la base de datos'
            });
        }

        await userDB.populate('grupos').execPopulate();

        const usuario = {
            email: userDB.email,
            grupos: userDB.grupos
        };

        res.json({
            ok:true,
            usuario
        });

    });
});

userRoutes.get('/grupos', verificaToken, (req: any, res: Response) => {
    Grupos.find().then( gruposDB => {
        res.json({
            ok: true,
            grupos: gruposDB
        });
    });
});


///////////////////////////////////////////////////////////
//////////////////// RUTAS NUEVAS /////////////////////////
///////////////////////////////////////////////////////////

userRoutes.get('/obtener/usuarios', verificaToken, async (req: any, res: Response) => {

   await Usuario.find({}, {password: 0})/*.populate('grupos')*/.then( usuarioDB => {

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    }).catch( err => {
        res.json({
            ok: false,
            err
        });
    });
});

userRoutes.get('/obtener/usuarios/:filtro', verificaToken, (req: Request, res: Response) => {

    const filtro = req.params.filtro;
    console.log(filtro);
    Usuario.find({'nombre': {'$regex': filtro, '$options':'i'}}).then(usuarioDB => {

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

userRoutes.post('/bloqueo/usuario', verificaToken, (req: Request, res: Response) => {
    const usuario = {
        enabled: req.body.enable,
    };

    Usuario.findByIdAndUpdate( req.body._id, usuario, {new: true}, async (err, usuarioDB) => {

        if(err) throw err;

        if (!usuarioDB) {
            return res.json({
                ok: false,
                mensaje: 'NO existe un ususario con ese ID'
            });
        }
         
         res.json({
             ok:true,
             usuario: usuarioDB
         });

    })
});

export default userRoutes;