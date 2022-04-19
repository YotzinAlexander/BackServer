import { Schema, Document, model} from 'mongoose';


const mensajeSchema = new Schema({
    created: {
        type: Date
    },
    texto: {
        type: String
    },
    img: [{
        type: String
    }],
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir una referencia a un usuario']
    },
    grupo: {
        type: Schema.Types.ObjectId,
        ref: 'Grupos',
        required: [true, 'Debe existir una referencia a un grupo']
    },
    responder: {
        type: Schema.Types.ObjectId,
        ref: 'Mensaje',
    },
    reenviar: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    eliminar: {
        type: Boolean,
        default: false
    },
    doc: [{
        type: String
    }]
});

mensajeSchema.pre<IMensaje>('save', function(next){
    this.created = new Date();
    next();
});

interface IMensaje extends Document {
    created: Date;
    texto: string;
    img: string[];
    doc: string[];
    usuario: string;
    grupo: string;
    responder: string;
    eliminar: string
}

export const Mensaje = model<IMensaje>('Mensaje', mensajeSchema);