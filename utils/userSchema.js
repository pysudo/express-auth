const Joi = require('joi');


const userSchema = Joi.object({
    
    userDetails: Joi.object({
        username: Joi.string()
            .min(6)
            .max(30)
            .required(),
        password: Joi.string()
            .min(8)
            .max(128)
            .required(),
        firstname: Joi.string()
            .max(100)
            .required(),
        lastname: Joi.string()
            .max(100)
            .required()
    }).required()
})

module.exports = userSchema;