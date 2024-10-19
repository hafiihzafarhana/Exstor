import Joi, { ObjectSchema } from 'joi';

export const signUpDTO: ObjectSchema = Joi.object().keys({
  password: Joi.string().min(8).max(24).required().messages({
    'string.base': 'format password salah',
    'string.min': 'password min 8 karakter',
    'string.max': 'password max 24 karakter',
    'string.empty': 'password wajib diisi'
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'format email salah',
    'string.email': 'email tidak valid',
    'string.empty': 'email wajib diisi'
  }),
  name: Joi.string().required().messages({
    'string.base': 'name should string',
    'string.empty': 'name is required'
  }),
  username: Joi.string().min(8).max(24).required().messages({
    'string.base': 'username should string',
    'string.empty': 'username is required'
  })
});

export const signInDTO: ObjectSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'string.base': 'format email salah',
    'string.email': 'email tidak valid',
    'string.empty': 'email wajib diisi'
  }),
  password: Joi.string().min(8).max(24).required().messages({
    'string.base': 'format password salah',
    'string.min': 'password min 8 karakter',
    'string.max': 'password max 24 karakter',
    'string.empty': 'password wajib diisi'
  })
});
