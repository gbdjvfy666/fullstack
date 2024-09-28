import jwt from "jsonwebtoken"; 
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import UserModel from '../Models/User.js';


export const register = async (req, res) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json(errors.array());  // Отправка ответа в случае ошибки
      }
      
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      
      const doc = new UserModel({
          email: req.body.email,
          fullName: req.body.fullName,
          avatarUrl: req.body.avatarUrl,
          passwordHash: hash,
      });

      const user = await doc.save();

      const token = jwt.sign(
          {
              _id: user._id
          },
          'secret123',
          {
              expiresIn: '30d'
          }
      );
      
      const { passwordHash, ...userData } = user._doc;

      res.json({ ...userData, token }); // Отправка успешного ответа
      
  } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Не получилось зарегистрироваться' });  // Отправка ответа при ошибке
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return res.status(400).json({ message: 'Неверный логин или пароль' });
    }

    const token = jwt.sign(
      { _id: user._id },
      'secret123',
      { expiresIn: '30d' }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Не получилось авторизоваться' });
  }
};

export const getme = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err); // Добавлена обработка ошибки
    res.status(500).json({ message: 'Не удалось получить данные пользователя' });
  }
};