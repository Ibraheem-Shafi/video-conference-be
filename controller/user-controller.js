import User from './../schema/user-schema.js';
import jwt from 'jsonwebtoken';
import secretKey from './../auth-key.cjs';

export const getUsers = async (request, response) => {
  console.log("Code execution started of getUsers");
  try {
    const users = await User.find({});
    response.status(200).json(users);
  } catch (error) {
    response.status(403).json({ message: error.message });
  }
};

export const getUser = async (request, response) => {
  console.log("Code execution started of getUser");
  try {
    const user = await User.findById(request.params.id);
    response.status(200).json(user);
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
};

export const getUserByEmail = async (request, response) => {
  console.log("Code execution started of getUserByEmail");
  try {
    const email = request.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      return response.status(404).json({ message: 'User not found' });
    }

    response.status(200).json(user);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const editUser = async (request, response) => {
  console.log("Code execution started of editUser");
  let user = request.body;
  const editUser = new User(user);
  try {
    await User.updateOne({ _id: request.params.id }, editUser);
    response.status(200).json(editUser);
  } catch (error) {
    response.status(409).json({ message: error.message });
  }
};

export const deleteUser = async (request, response) => {
  console.log("Code execution started of deleteUser");
  try {
    await User.deleteOne({ _id: request.params.id });
    response.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    response.status(403).json({ message: error.message });
  }
};



// Example function to generate a JWT token
const generateToken = (user) => {
  // Generate and return the token using jwt.sign()
  console.log('hi');
  const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
  
  console.log('Generated token:', token);
  return token;
};

export const loginUser = async (request, response) => {
  const { email, password, role } = request.body;

  try {
    // Find the user by email

    console.log('Login request:', email, password);
    
    const user = await User.findOne({ email });
    console.log(user.role)

    console.log('user is found by email')

    // Check if the user exists and if the password is correct
    if (!user || !user.comparePassword(password)) {
      response.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // If the user is found and the password is correct, you can generate an authentication token
    // and send it back to the client for further authentication

    // Example using JWT (JSON Web Token) for token generation
    const token = generateToken(user);

    response.status(200).json({ token, role: user.role });
  } catch (error) {
    console.log('Error:', error.message); // Log the error message
    response.status(500).json({ message: error.message });
  }
};