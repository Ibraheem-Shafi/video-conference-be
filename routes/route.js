import express from 'express';
import { getUsers, getUser, editUser, deleteUser, loginUser } from './../controller/user-controller.js';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames
import fs from 'fs';
import User from './../schema/user-schema.js';

const router = express.Router();

const saveProfilePicture = (file) => {
  const uniqueFilename = `${uuidv4()}${path.extname(file.name)}`;
  const filePath = path.join('public', 'profile-pictures', uniqueFilename);

  return new Promise((resolve, reject) => {
    file.mv(filePath, (err) => {
      if (err) {
        console.log('Error while uploading profile picture:', err);
        reject(err);
      } else {
        resolve(uniqueFilename); // Return only the filename without the path
      }
    });
  });
};

router.post('/add', async (req, res) => {
  try {
    // If a file is uploaded, save the profile picture and get the filename
    let filename;
    if (req.files && req.files.profilePicture) {
      filename = await saveProfilePicture(req.files.profilePicture);
    }

    const user = req.body;
    
    // Set the profilePicture field in the user object with the filename
    if (filename) {
      user.profilePicture = filename;
    }

    const newUser = new User(user);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.log('Error while adding user: ', error);
    res.status(409).json({ message: error.message });
  }
});

router.get('/all', getUsers);
router.get('/user/:id', getUser);
router.put('/user/:id', editUser);
router.delete('/user/:id', deleteUser);
router.post('/login', loginUser);

export default router;