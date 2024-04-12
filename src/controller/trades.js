const _ = require("lodash");
const createErrors = require("http-errors");

const TradesModel = require("../models/trade");
const TradeJoiSchema = require("../models/trade.validate")

exports.create_trade = async (req, res, next) => {
    try {
        const validateTrade = await TradeJoiSchema.validateAsync({ ...req.body });
        const tradesLength = await TradesModel.countDocuments() + 1;
        const trade = new TradesModel({
            id: tradesLength,
            ...req.body
        });
        const response = await trade.save();
        if (_.isEmpty(response)) return next(createErrors.Conflict("Something went"));
        return res.send({ status: "SUCCESS", response });
    } catch (error) {
        if (error.isJoi) return next(createErrors.BadRequest())
        return next(error);
    }
}


exports.fetch_all_trades = async (req, res, next) => {
    try {
        const query = req.query;
        const response = await TradesModel.find({ $or: [query] });
        if (_.isEmpty(response)) return next(createErrors.NotFound("No Trades Found!"));
        return res.send({ status: "SUCCESS", response });
    } catch (error) {
        return next(error);
    }
}

exports.fetch_trade = async (req, res, next) => {
    try {
        const id = req.params.id;
        const response = await TradesModel.findOne({ id: id });
        if (_.isEmpty(response)) return next(createErrors.NotFound("Trade not found!"));
        return res.send({ status: 'SUCCESS', response })
    } catch (error) {
        return next(error);
    }
}