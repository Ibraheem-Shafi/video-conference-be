import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; 

const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    password: String,
    role: String,
    profilePicture: String,
    email: {
      type: String,
      unique: true,
    },
    contacts: {
      type: Number,
      default: 0,
    },
    registrationDate: {
      type: Date,
      default: Date.now
    }
})

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const user = mongoose.model('user', userSchema)

export default user;