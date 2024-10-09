import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import { UserController, PostController, CommentController } from './controllers/index.js';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

const URL = 'mongodb+srv://lepeha:Pass123@cluster0myself.ij4cz.mongodb.net/';

// Подключение к базе данных MongoDB
mongoose
  .connect(URL)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error:', err));

const app = express();

// Настройки для хранения загруженных файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Middlewares
app.use(express.json()); // Распознавание JSON запросов
app.use('/uploads', express.static('uploads')); // Доступ к загруженным файлам
app.use(cors()); // Открытие доступа для запросов из разных доменов

// Роуты авторизации
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getme);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    console.error('Файл не был загружен');
    return res.status(400).json({ message: 'Файл не был загружен' });
  }

  console.log('Файл загружен:', req.file);
  
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// Роуты для работы со статьями
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create); // Создание статьи
app.get('/posts', PostController.getAll); // Получение всех статей
app.get('/posts/tags', PostController.getLastTags); // Получение тегов последних статей
app.get('/tags', PostController.getAllTags); // Новый маршрут для получения всех тегов
app.get('/posts/:id', PostController.getOne); // Получение статьи по ID
app.delete('/posts/:id', checkAuth, PostController.remove); // Удаление статьи по ID
app.patch('/posts/:id', postCreateValidation, checkAuth, handleValidationErrors, PostController.update); // Обновление статьи по ID

// Роуты для комментариев
app.post('/comments', checkAuth, CommentController.create); // Для создания комментария
app.get('/comments/:id', CommentController.getCommentsByPost); // Для получения комментариев по ID поста

// Запуск сервера
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
