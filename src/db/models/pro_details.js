const mongoose = require("mongoose");

const pro_details = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    registration_number: {
        type: String,
        default: ""
    },
    membership_grade: {
        type: String,
        default: ""
    },
    membership_branch: {
        type: String,
        default: ""
    },
    membership_division: {
        type: String,
        default: ""
    },
    membership_status: {
        type: String,
        default: ""
    },
    finicial_status: {
        type: String,
        default: ""
    },
    specialization: {
        type: String,
        default: ""
    },
    coren_number: {
        type: String,
        default: ""
    },
    coren_engineering_category: {
        type: String,
        default: ""
    },
    coren_registration_date: {
        type: Date,
    }
});

pro_details.set("toJSON", {
    transform: (doc, ret, opt) => {
        delete ret["__v"];
        ret.id = ret._id;
        delete ret._id;
        return ret;
    },
});

module.exports = mongoose.model("pro_details", pro_details);