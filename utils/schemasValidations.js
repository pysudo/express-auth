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
        website: Joi.string()
            .allow(''),
        pan: Joi.string()
            .length(10)
            .required(),
        gst: Joi.string()
            .length(15)
            .required(),
        contacts: Joi.object({
            email: Joi.string().email()
                .required(),
            landline: Joi.string()
                .length(8)
                .required(),
            phone: Joi.string()
                .length(10)
                .required(),
        }).required(),
        bankDetails: Joi.object({
            bankName: Joi.string()
                .required(),
            bankAddress: Joi.string()
                .required(),
            accountType: Joi.string()
                .valid("savings", "current", "others")
                .required(),
            accountNumber: Joi.number()
                .required(),
            ifsc: Joi.string()
                .required(),
        }).required(),
    }).required()
})


module.exports.purchaseSchema = Joi.object({

    purchase: Joi.object({
        name: Joi.string()
            .required(),
        address: Joi.string()
            .required(),
        email: Joi.string()
            .required(),
        contact: Joi.string()
            .length(10)
            .required(),
        pan: Joi.string()
            .length(10)
            .required(),
        gst: Joi.string()
            .length(15)
            .required(),
        bankDetails: Joi.object({
            bankName: Joi.string()
                .required(),
            bankAddress: Joi.string()
                .required(),
            accountType: Joi.string()
                .valid("savings", "current", "others")
                .required(),
            accountNumber: Joi.number()
                .required(),
            ifsc: Joi.string()
                .required(),
        }).required(),
        activeStatus: Joi.string()
    }).required()
});


module.exports.transactionSchema = Joi.object({

    transaction: Joi.object({
        date: Joi.date()
            .required(),
        amount: Joi.number()
            .required(),
        description: Joi.string()
            .required(),
        mode: Joi.string()
            .valid("Cash", "Online", "Others")
            .required(),
        referenceNumber: Joi.string()
            .required()
    }).required()
});


module.exports.clientSchema = Joi.object({

    client: Joi.object({
        name: Joi.string()
            .required(),
        address: Joi.string()
            .required(),
        email: Joi.string()
            .required(),
        contact: Joi.string()
            .length(10)
            .required(),
        gst: Joi.string()
            .required(),
        pan: Joi.string()
            .required(),
    }).required()
});


module.exports.paymentSchema = Joi.object({

    payment: Joi.object({
        amountPayed: Joi.number()
            .required(),
        mode: Joi.string()
            .valid("NEFT", "RTGS", "Cash", "Net Banking")
            .required(),
        additionalInfo: Joi.string()
            .allow('')
    }).required()
});

