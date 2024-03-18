const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const env = require("../config/env.js");
const payment = require("../../db/models/payment.js");
const user = require("../../db/models/userModel.js");
const axios = require('axios');

const add_payment = () => {
    return async (req, res, next) => {
        try {
            data = req.body;
            data.user = req.user.id;
            const paymentData = await payment.create(data);
            console.log(env.FLW_SECRET_KEY)
            userdata = await user.findById(req.user.id);
            const response = await axios.post("https://api.flutterwave.com/v3/payments", {
            tx_ref: paymentData.id,
            amount: paymentData.amount,
            currency: "NGN",
            redirect_url: `${env.config.HOST}/user/payment-done`,
            customer: {
                email: userdata.email,
                phonenumber: userdata.phone_number,
                name: userdata.name + " " + userdata.last_name,
            },
            customizations: {
                title: "Tax Payment",
            }
        }, {
            headers: {
                Authorization: `Bearer ${env.config.FLW_SECRET_KEY}`
            }
        });

        console.log(response["data"]);

        res.status(200).send({
            status: "success",
            message: "Payment created successfully",
            data: response.data
        });

    } catch (err) {
            console.log(err);
            res.status(500).send({
                status: "error",
                message: "an error occured while adding",
            });
        }
    };
};

const payment_done = () => {
    return async (req, res, next) => {
        try {
            const paymentData = await payment.findById(req.query.tx_ref);
            if (req.query.status === "successful") {
                paymentData.payment_status = "successful";
                await paymentData.save();
                return res.send("<h1>Payment successful</h1>");
            }
            paymentData.payment_status = "failed";
            await paymentData.save();
            return res.send("<h1>Payment failed</h1>");
        } catch (err) {
            console.log(err);
            res.status(500).send({
                status: "error",
                message: "an error occured while adding",
            });
        }
    };
};

exports.add_payment = add_payment;
exports.payment_done = payment_done;
