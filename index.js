import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from './Models/User.js';
import bcrypt from 'bcrypt';

const URL = 'mongodb+srv://lepeha:Pass123@cluster0myself.ij4cz.mongodb.net/'

mongoose
  .connect(URL)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB errror', err));
 
const app = express();

app.use(express.json());

app.post('/auth/register', registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400),json(errors.array());
  }

  const password = req.body.password;
  const salt = await bcrypt.genSalt(10); // salt это алгоритм шифрования пароля
  const passwordHash = await bcrypt.hash(password, salt);

  const doc = new UserModel({
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    passwordHash,
  });

  const user = await doc.save();

  res.json(user);
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});