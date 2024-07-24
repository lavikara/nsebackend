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
    ref : {
        type: String,
        required: true,
    },
    payment_date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "pending",
    },
});
PaymentSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});


const PaymentModel = mongoose.model("payments", PaymentSchema);

module.exports = PaymentModel;