const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bookings',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    mode: {
        type: String,
        enum: ['credit card', 'pay-in-hotel'],
        required: true
    },
    status : {
        type: String,
        enum: ['paid', 'to be paid'],
        required: true
    },
    transactionNumber: {
        type: String,
        required: true
    }
}, { timestamps: true });

const paymentModel = mongoose.model("payments", paymentSchema);
module.exports = paymentModel;
