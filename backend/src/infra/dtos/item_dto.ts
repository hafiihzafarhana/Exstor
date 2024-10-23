import Joi, { ObjectSchema } from 'joi';

export const createItemDTO: ObjectSchema = Joi.object().keys({
  parent_id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .allow(null)
    .messages({
      'string.base': 'format parent_id salah',
      'string.guid': 'parent_id harus berupa UUID yang valid atau null'
    }),
  name: Joi.string().required().messages({
    'string.base': 'nama harus string',
    'string.empty': 'nama harus diisi'
  })
});

export const updateItemDTO: ObjectSchema = Joi.object().keys({
  id: Joi.string().uuid().required().messages({
    'string.base': 'ID harus berupa string',
    'string.empty': 'ID harus diisi',
    'string.uuid': 'ID harus berupa UUID yang valid'
  }),
  new_name: Joi.string().required().messages({
    'string.base': 'nama harus string',
    'string.empty': 'nama harus diisi'
  })
});

export const copyItemDTO: ObjectSchema = Joi.object().keys({
  id: Joi.string().uuid().required().messages({
    'string.base': 'ID harus berupa string',
    'string.empty': 'ID harus diisi',
    'string.uuid': 'ID harus berupa UUID yang valid'
  })
});

export const copyItemPathDTO: ObjectSchema = Joi.object().keys({
  item_id: Joi.string().uuid().required().messages({
    'string.base': 'ID harus berupa string',
    'string.empty': 'ID harus diisi',
    'string.uuid': 'ID harus berupa UUID yang valid'
  }),
  parent_id: Joi.string().uuid().required().messages({
    'string.base': 'ID harus berupa string',
    'string.empty': 'ID harus diisi',
    'string.uuid': 'ID harus berupa UUID yang valid'
  })
});
