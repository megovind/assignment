const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: Number,
    username: { type: String, default: null },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model("Users", userSchema);
