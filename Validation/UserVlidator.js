const Joi = require('joi');

const UserValidor=Joi.object({
    name: Joi.string().trim().required().min(8).max(255).messages({
        'string.base': `Name must be a string`,
        'string.empty': `Name cannot be empty`,
        'string.min': `Name should have a minimum length of {#limit}`,
        'string.max': `Name should have a maximum length of {#limit}`,
        'any.required': `Name is required`,
      }),
    email:Joi.string().email().required(),
    password:Joi.string().min(5).max(15).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')).required(),
   
})


module.exports=UserValidor