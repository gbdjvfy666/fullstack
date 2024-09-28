import { body } from "express-validator";

export const registerValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 4}),
  body('fullName').isLength({ min: 2}),
  body('avatarUrl').optional().isURL(),
];

export const loginValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 4}),
];

export const postCreateValidayion = [
  body('title', 'Введите заголовок статьи').isLength({min:3}).isString(),
  body('text', 'текст статьи').isString(),
  body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение ').optional().isString(),
];