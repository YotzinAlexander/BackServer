import { Schema, Document, model} from 'mongoose';


const reportesSchema = new Schema({
    folio: {
        type: String
    },
    fecha: {
        type: String
    },
    hora: {
        type: String
    },
    motivo: {
        type: String
    },
    descripcion: {
        type: String
    },
    coord_x: {
        type: String
    },
    coord_y: {
        type: String
    },
    enchat: {
        type: Boolean,
        default: false
    }
});


interface IReporte extends Document {
    folio: string;
    fecha: string;
    hora: string;
    motivo: string;
    descripcion: string;
    coord_x: string;
    coord_y: string;
    enchat: string
}

export const Reporte = model<IReporte>('Reporte', reportesSchema);