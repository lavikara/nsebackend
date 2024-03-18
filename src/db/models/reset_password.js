const mongoose = require("mongoose");

const resetPasswordSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    token: {
        type: String,
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
});

const resetPasswordModel = mongoose.model("reset_password", resetPasswordSchema);

module.exports = resetPasswordModel;