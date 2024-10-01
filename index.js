import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { UserController, PostController } from './controllers/index.js'
import checkAuth from './utils/checkAuth.js';

import multer from 'multer';
import handleValidationErrors from './utils/handleValidationErrors.js';

const URL = 'mongodb+srv://lepeha:Pass123@cluster0myself.ij4cz.mongodb.net/';

mongoose
  .connect(URL)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => { // Исправлено здесь
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => { // Исправлено здесь
    cb(null, file.originalname);
  },
});


const upload = multer({ storage });

app.use(express.json()); // чтобы express распознавал JSON
app.use('/uploads', express.static('uploads'))
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);// Логин пользователя
app.post('/auth/register',registerValidation, handleValidationErrors, UserController.register); // Регистрация пользователя
app.get('/auth/me', checkAuth, UserController.getme); // Получение данных о пользователе
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create); // Создание статьи

app.get('/posts', PostController.getAll); // Получение всех статей

app.get('/posts/:id', PostController.getOne); // Получение одной статьи

app.delete('/posts/:id', checkAuth, PostController.remove); // Удаление статьи

app.patch('/posts/:id', postCreateValidation, checkAuth, handleValidationErrors, PostController.update); // Обновление статьи



app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
