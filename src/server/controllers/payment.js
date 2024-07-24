const jwt = require("jsonwebtoken");
const payment = require("../../db/models/payment.js");
const User = require("../../db/models/userModel.js");
const axios = require('axios');
const env = require("../config/env.js");

// Require paystack library
const paystack = require("paystack-api")(env.config.PAYSTACK_SECRET);

// initialize transaction
const add_payment = () => {
    return async (req, res) => {
        try {
            let user = await User.findById(req.user.id)
            const { amount } = req.body;
            if (!amount) {
                throw new Error("Amount is required");
            }
            let email = user.email;

            const response = await paystack.transaction.initialize({
                email,
                amount: amount * 100,
            });

            const data = {
                paystack_ref: response.data.reference,
            };

            payment.create({
                user: user._id,
                amount,
                ref: response.data.reference,
            });

            res.status(200).send({
                data: response.data,
                message: response.message,
                status: response.status,
            });

        } catch (error) {
            res.status(400).send({ data: {}, error: `${error.message}`, status: 1 });
        }
    }
};


const payment_done = () => {
    return async (req, res, next) => {
        try {

            const ref = req.params.ref;
            
            const response = await paystack.transaction.verify({
                reference: ref},
            );
            
            if (response.data.status === "success") {

                const paymentDetails = await payment.findOne({ ref: ref });
                
                if (!paymentDetails) {
                    throw new Error('Payment details not found');
                }
                
                paymentDetails.status = "success";
                await paymentDetails.save();
                
                res.status(200).send({
                    data: {
                        payment: paymentDetails.toJSON(),
                    },
                    message: response.message,
                    status: response.status,
                });
            } else {
                res.status(400).send({
                    message: "payment failed"
                });
            }

        } catch (error) {
            console.error(error);
            res.status(400).send({ data: {}, error: `${error.message}`, status: 1 });
        }
    };
};

const get_history = (id) => {
    return async (req, res, next) => {
        try {
            let payments = await payment.find({ user: req.params.id });
            res.status(200).send({
                status: "success",
                message: "Payment history retrieved successfully",
                data: payments.map(payment => payment.toJSON()),
            });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                status: "error",
                message: "An error occured while trying to get payment history",
            });
        }
    }
}

exports.add_payment = add_payment;
exports.payment_done = payment_done;
exports.get_history = get_history;