// Modules
import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcryptjs';

// User schema
const User = new Schema({
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: {
        type: String,
        index: true,
        unique: true,
        required: true,
    },
    password: { type: String, required: true },
    photo: { type: String },
    theme: { type: Boolean, required: true },
    creation_date: { type: String, required: true },
});

// Validation plugin for unique values
User.plugin(uniqueValidator);

// Password encryption method
User.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Metodo de validacion de password
User.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Export del modelo de user
module.exports = model('Users', User);
