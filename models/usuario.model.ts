import { Schema, model, Document} from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [ true, 'el nombre es necesario']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [ true, 'El correo es necesario']
    },
    corporacion: {
        type: String
    },
    grupos: [{
        type: Schema.Types.ObjectId,
        ref: 'Grupos',
        required: [true, 'Debe existir una referencia a un grupo']
    }],
    password: {
        type: String,
        required: [ true, 'La contraseña es necesaria']
    },
    enabled: {
        type: Boolean,
        default: true
    },onesignal:{
        type: String
    },uType:{
        type: String
    }

});

usuarioSchema.method('compararPassword', function(password: string = ''): boolean {

    if (bcrypt.compareSync(password, this.password)) {
        return true;
    } else {
        return false;
    }
});

interface IUsuario extends Document {
    nombre: string;
    email: string;
    corporacion: string;
    password: string;
    avatar: string;
    grupos: string[];
    enabled: boolean;
    onesignal: string;
    uType: string;

    compararPassword(password: string): boolean;
}

usuarioSchema.method('compararMail', function(email: string = ''): boolean {
    if (email === this.email) {
        return true;
    } else {
        return false;
    }
});


interface IUsuario extends Document {
    nombre: string;
    email: string;
    corporacion: string;
    password: string;
    avatar: string;
    grupos: string[];
    enabled: boolean;
    onesignal: string;
    uType: string;

    compararMail(email: string): boolean;
    
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);



