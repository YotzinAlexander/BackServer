import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';


export default class FileSystem {

    constructor() {}

    guardarImagenTeporal( file: FileUpload, userId: string) {



        return new Promise( (resolve, reject) => {

            // crear carpetas
            const path = this.crearCarpetaUsuario( userId );

            // crear nombre de archivo
            const nombreArchivo = this.generarNombreUnico( file.name );
            //console.log(file.name);

            // Mover el archivo a la carpeta temp

            file.mv( `${path}/${nombreArchivo}`, (err: any) => {

                if( err ) {
                   reject(err);
                } else {
                   resolve();
                }
            });

        });
    }

    guardarArchivoenTemporales( file: FileUpload, userId: string) {

        return new Promise( (resolve, reject) => {

            // crear carpetas
            const path = this.crearCarpetaUsuario( userId );

            // crear nombre de archivo
            //const nombreArchivo = this.generarNombreUnico( file.name );
            console.log(file.name);

            // Mover el archivo a la carpeta temp

            file.mv( `${path}/${file.name}`, (err: any) => {

                if( err ) {
                   reject(err);
                } else {
                   resolve();
                }
            });

        });
    }

    private crearCarpetaUsuario( userId: string) {

        const pathUser = path.resolve( __dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        // console.log(pathUser);

        const existe = fs.existsSync(pathUser);


        if(!existe) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp;
    }

    private generarNombreUnico( nobreOriginal: string) {

        const nombreArr = nobreOriginal.split('.');
        const extension = nombreArr[ nombreArr.length - 1];

        const idunico = uniqid();

        return `${idunico}.${extension}`;
    }

    imagenesDeTempHaciaMensajes(userId: string) {
        const pathTemp = path.resolve( __dirname, '../uploads/', userId, 'temp');
        const pathMensaje = path.resolve( __dirname, '../uploads/', userId, 'mensajes');

        if (!fs.existsSync( pathTemp)) {
            return [];
        }

        if (!fs.existsSync(pathMensaje)) {
            // Crea directorio en caso que no exista
            fs.mkdirSync(pathMensaje);
        }
            // Arcgivos e imagenes de temp a mensajes
        const imagenesTemp = this.obtenerImagenesEnTemp( userId);
        

        imagenesTemp.forEach( imagen => {
            fs.renameSync(`${pathTemp}/${imagen}`, `${pathMensaje}/${imagen}`)
        });

       return imagenesTemp;
    }

    private obtenerImagenesEnTemp(userId: string) {

        const pathTemp = path.resolve( __dirname, '../uploads/', userId, 'temp');

        return fs.readdirSync(pathTemp) || [];
    }

    getFotoUrl( grupo: string, img: string) {

        // Path Imagenes
        const pathFoto = path.resolve( __dirname, '../uploads', grupo, 'mensajes', img)

        // si la imagen existe 


        return pathFoto;
    }
}