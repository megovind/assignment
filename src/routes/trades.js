const express = require("express");
const router = express.Router();

const TradesController = require("../controller/trades");
const { verifyAccessToken } = require("../helpers/jwt_helper");

router.post(
    "/create-trade",
    verifyAccessToken,
    TradesController.create_trade
);

router.get(
    "/fetch-all-trades",
    verifyAccessToken,
    TradesController.fetch_all_trades
);

router.get(
    "/fetch-trade/:id",
    verifyAccessToken,
    TradesController.fetch_trade
)

module.exports = router;