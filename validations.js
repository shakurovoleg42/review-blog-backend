import { body } from "express-validator";

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум из 6 символов').isLength({ min: 3 }),
];

export const registerValidation = [
  body('email','Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум из 6 символов').isLength({ min: 3 }),
  body('fullName', 'Укажите имя').isLength({ min: 2 }),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Ввести заголовок статьи').isLength({min: 2}).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов (уажите массив)').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];