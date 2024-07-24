const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const env = require("../config/env.js");
const payment = require("../../db/models/payment.js");
const User = require("../../db/models/userModel.js");
const axios = require('axios');

// Require paystack library
const paystack = require("paystack-api")('sk_test_a64a4a9d9ae98c4d63e3c06c8343c0244ffab3d6');

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