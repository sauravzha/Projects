import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
    comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
}, { timestamps: true });

// Method to compare password
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
    return await bcrypt.compare(candidate, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
