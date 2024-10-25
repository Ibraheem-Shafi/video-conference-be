import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Change this to bcryptjs

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
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash the password if it has been modified
    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next(); // Proceed to save the user
    } catch (error) {
        next(error); // Pass any errors to the next middleware
    }
});

// Method to compare the provided password with the stored hashed password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password); // Compare with bcryptjs
};

const User = mongoose.model('User', userSchema); // Capitalized model name for convention

export default User;
