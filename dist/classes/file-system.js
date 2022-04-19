"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    guardarImagenTeporal(file, userId) {
        return new Promise((resolve, reject) => {
            // crear carpetas
            const path = this.crearCarpetaUsuario(userId);
            // crear nombre de archivo
            const nombreArchivo = this.generarNombreUnico(file.name);
            //console.log(file.name);
            // Mover el archivo a la carpeta temp
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    guardarArchivoenTemporales(file, userId) {
        return new Promise((resolve, reject) => {
            // crear carpetas
            const path = this.crearCarpetaUsuario(userId);
            // crear nombre de archivo
            //const nombreArchivo = this.generarNombreUnico( file.name );
            console.log(file.name);
            // Mover el archivo a la carpeta temp
            file.mv(`${path}/${file.name}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    crearCarpetaUsuario(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        // console.log(pathUser);
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    generarNombreUnico(nobreOriginal) {
        const nombreArr = nobreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idunico = uniqid_1.default();
        return `${idunico}.${extension}`;
    }
    imagenesDeTempHaciaMensajes(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathMensaje = path_1.default.resolve(__dirname, '../uploads/', userId, 'mensajes');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathMensaje)) {
            // Crea directorio en caso que no exista
            fs_1.default.mkdirSync(pathMensaje);
        }
        // Arcgivos e imagenes de temp a mensajes
        const imagenesTemp = this.obtenerImagenesEnTemp(userId);
        imagenesTemp.forEach(imagen => {
            fs_1.default.renameSync(`${pathTemp}/${imagen}`, `${pathMensaje}/${imagen}`);
        });
        return imagenesTemp;
    }
    obtenerImagenesEnTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getFotoUrl(grupo, img) {
        // Path Imagenes
        const pathFoto = path_1.default.resolve(__dirname, '../uploads', grupo, 'mensajes', img);
        // si la imagen existe 
        return pathFoto;
    }
}
exports.default = FileSystem;
