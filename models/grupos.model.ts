import { Schema, model} from 'mongoose';

const grupoSchema = new Schema({

    nombre: {
        type: String,
        required: [ true, 'el nombre es necesario'],
        unique: true
    },
    img: {
        type: String,
        default: 'grupo.png'
    },
    enabled: {
        type: Boolean,
        default: true
    }
});


export const Grupos = model('Grupos', grupoSchema);