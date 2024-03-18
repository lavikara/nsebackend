const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    payment_date: {
        type: Date,
        default: Date.now,
    },
    payment_status: {
        type: String,
        default: "pending",
    },
});


const PaymentModel = mongoose.model("payments", PaymentSchema);

module.exports = PaymentModel;