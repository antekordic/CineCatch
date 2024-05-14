import mongoose, { Document, Schema } from 'mongoose';  //Document ermöglicht Methoden wie save(), remove() und findbyid zu nutzen

// Definiert das Interface User und gibt somit eine Struktur zur datenübergabe vor

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  toWatch: string[];
  watched: Map<string, number>;
}

// Definiert das Mongoose Schema für den Benutzer

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  toWatch: [{ type: String }],          //towatch -> zu sehen
  watched: { type: Map, of: Number }    //watched -> gesehen speichert mit bewertung
});

// Erstellt das UserModel
export const UserModel = mongoose.model<User>('User', userSchema);