const Joi = require('joi');


module.exports.userSchema = Joi.object({

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


module.exports.profileSchema = Joi.object({

    profile: Joi.object({
        name: Joi.string()
            .required(),
        address: Joi.string()
            .required(),
        contacts: Joi.object({
            landline: Joi.string()
                .length(8)
                .required(),
            phone: Joi.string()
                .length(10)
                .required(),
        }).required(),
        pan: Joi.string()
            .length(10)
            .required(),
        gst: Joi.string()
            .length(15)
            .required()
    }).required()
})


module.exports.purchaseSchema = Joi.object({

    purchase: Joi.object({
        name: Joi.string()
            .min(6)
            .max(30)
            .required(),
        address: Joi.string()
            .required(),
        email: Joi.string()
            .required(),
        contact: Joi.string()
            .length(10)
            .required(),
        bankDetails: Joi.object({
            bankName: Joi.string()
                .required(),
            accountType: Joi.string()
                .valid('savings', 'current', 'others')
                .required(),
            accountNumber: Joi.number()
                .required(),
            ifsc: Joi.string()
                .required(),
            activeStatus: Joi.string()
                .required()
        }).required()
    })
});

