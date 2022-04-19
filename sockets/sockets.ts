import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { Mensaje } from '../models/mensaje.model';
import FileSystem from '../classes/file-system';


let grupo: string;
const fileSystem = new FileSystem();

export const desconectar = (cliente: Socket) => {
    cliente.on('disconnect', () => {
        console.log('Cliente Desconectado');
    });
}

// Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload: 
        {   
            _id: string, 
            grupo: string,
            texto: string
        }) => {

        grupo = payload.grupo;
        

        cliente.join(payload.grupo);

        const mensaje = {
            texto: payload.texto,
            usuario: payload._id,
            grupo: payload.grupo
        }

        Mensaje.create(mensaje).then( async mensajeDB => {
            await mensajeDB.populate('grupo').execPopulate();
            await mensajeDB.populate('usuario', '-password').execPopulate();
            await mensajeDB.populate({path: 'responder', populate:{path: 'usuario'}}).execPopulate();

            // console.log('Mensaje recibido', payload);

            io.emit('mensaje-nuevo', mensajeDB);

        });
        
    });
}

export const mensajesViejos = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('mensajes-v', (payload: 
        {
        grupo: string
        }) => {

            cliente.join(payload.grupo);

            grupo = payload.grupo;

            console.log(grupo);

            // const skip = Mensaje.find({grupo: grupo}).skip(50);

            // const contar = skip.countDocuments().then( count => {
            //     console.log(count);

            //     if (count < 0) {
            //         Mensaje.find({grupo: grupo}).sort({$natural: 1}).limit(50).populate('usuario').populate('grupo').then( mensajesDB => {

            //             io.emit('mensajes-viejos', mensajesDB);
            //         });

            //     } else {

            //         Mensaje.find({grupo: grupo}).sort({$natural: 1}).limit(50).skip(count).populate('usuario').populate('grupo').then( mensajesDB => {

            //             io.to(grupo).emit('mensajes-viejos', mensajesDB);
            //         });
            //     }

                
            // });


        });
  
}

export const escribiendo = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('escribiendo', (payload: { grupo: string}) => {

        grupo = payload.grupo;

        io.emit('escribiendo', grupo);

    });
}

export const imagen = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('imagen', (payload: {_id: string, grupo: string}) => {
        
        const _id = payload._id;
        const grupo = payload.grupo;
        const file = fileSystem.imagenesDeTempHaciaMensajes(_id);

        const extension = file.toString().substr(-3);
        
        // Validacion para envio de archivo PDF O IMAGEN!! *****************************
        if(extension==='pdf'){
            const mensaje = {
                usuario: _id,
                grupo: grupo,
                doc: file
            }

            Mensaje.create(mensaje).then( async mensajeDB => {
                await mensajeDB.populate('grupo').execPopulate();
                await mensajeDB.populate('usuario','-password').execPopulate();
                await mensajeDB.populate({path: 'responder', populate:{path: 'usuario'}}).execPopulate();
    
                io.emit('mensaje-nuevo', mensajeDB);
    
            });
        }else{
            const mensaje = {
                usuario: _id,
                grupo: grupo,
                img: file
            }

            Mensaje.create(mensaje).then( async mensajeDB => {
                await mensajeDB.populate('grupo').execPopulate();
                await mensajeDB.populate('usuario','-password').execPopulate();
                await mensajeDB.populate({path: 'responder', populate:{path: 'usuario'}}).execPopulate();
    
                // console.log('Mensaje recibido', payload);
    
                io.emit('mensaje-nuevo', mensajeDB);
    
            });

        }
        

    });
}

    ////////////////////////////////////////////////////////////
   ////////////////////// NUVEOS SOCKETS //////////////////////
  ////////////////////////////////////////////////////////////

export const respuesta = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('respuesta', (payload: {idRes: string, respuesta: string, grupo: string, _id: string}) => {

        const _id = payload._id;
        const idRes = payload.idRes;
        const respuesta = payload.respuesta;
        const grupo = payload.grupo;

        const mensaje = {
            usuario: _id,
            grupo: grupo,
            responder: idRes,
            texto: respuesta
        };

        Mensaje.create(mensaje).then (async mensajeDB => {
            await mensajeDB.populate('grupo').execPopulate();
            await mensajeDB.populate('usuario', '-password').execPopulate();
            await mensajeDB.populate({path: 'responder', populate:{path: 'usuario'}}).execPopulate();

            io.emit('mensaje-nuevo', mensajeDB);
        })
    });
}

export const reenviar = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('reenviar', (payload: {texto: string, img: string,doc:string, reenviar: string, _id: string, grupo: string}) => {

       const _id = payload._id;
       const texto = payload.texto;
       const img = payload.img;
       const doc = payload.doc;
       const reenviar = payload.reenviar;
       const grupo = payload.grupo;

       const mensaje = {
           usuario: _id,
           texto,
           img,
           doc,
           reenviar,
           grupo
       }

       Mensaje.create(mensaje).then(async mensajeDB => {

            await mensajeDB.populate('grupo').execPopulate();
            await mensajeDB.populate('usuario', '-password').execPopulate();

            io.emit('mensaje-nuevo', mensajeDB);
       })

    })
}