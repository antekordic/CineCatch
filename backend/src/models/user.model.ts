import {Schema, model} from "mongoose";

export interface User{
    id:string;
    email:string;
    password:string;
    }

export const UserSchema = new Schema<User>({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    }, {
        timestamps: true,
        toJSON:{
            virtuals: true
        },
        toObject:{
            virtuals: true
    }
});
    
export const UserModel = model<User>('user', UserSchema);