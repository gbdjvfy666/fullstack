import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from './Models/User.js';
import bcrypt from 'bcrypt';
import User from './Models/User.js';

const URL = 'mongodb+srv://lepeha:Pass123@cluster0myself.ij4cz.mongodb.net/'

mongoose
  .connect(URL)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB errror', err));
 
const app = express();

app.use(express.json()); // что бы экспресс распозновал json

app.post('/auth/login', async (req, res) => {
  try {
    const user = await UserModel.findOne({email: req.body.email});

    if(!user) {
      return req.status(404).json({
        message: 'Пользователь не найден'
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return req.status(404).json({
      message: 'Неверный логин или пароль',
    });
  }
  } catch (err) {}
});

app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400),json(errors.array());
    }
  
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10); // salt это алгоритм шифрования пароля
    const hash = await bcrypt.hash(password, salt);
  
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });
  
    const user = await doc.save();
  
    const token = jwt.sign({
      _id: user._id,
    }, 
    'secret123',
    {
      expiresIn: '30d',
    },
  );

  const {passwordHash, ...userData} = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'не получилось зарегестрироваться'
    })
  }
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});