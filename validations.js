import { body } from "express-validator";

export const loginValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 4}),
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'нужен пароль сложнее').isLength({ min: 4}),
  body('fullname', 'укажите имя').isLength({ min: 2}),
  body('avatarUrl', 'неверная ссылка на аватарку').optional().isURL(),

];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min:3 }).isString(),
  body('text', 'текст статьи').isLength({ min: 1 }).isString(),
  body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение ').optional().isString(),
];