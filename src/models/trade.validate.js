const Joi = require('joi');

const tradeSchema = Joi.object({
    type: Joi.string().required(),
    user_id: Joi.number().required(),
    symbol: Joi.string().required(),
    shares: Joi.number().required(),
    price: Joi.number().required()
});

module.exports = tradeSchema;