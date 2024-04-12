const mongoose = require('mongoose');

const tradesSchema = new mongoose.Schema({
    id: Number,
    user_id: { type: Number, required: true },
    type: { type: String, default: 'buy' },
    symbol: { type: String, required: true },
    shares: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});


module.exports = mongoose.model("trades", tradesSchema);
