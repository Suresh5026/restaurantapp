const express = require('express');
const router = express.Router();
const paymentModel = require('../Models/paymentModel');
const bookModel = require('../Models/bookModel');
const validateToken = require('../middleWares/validateToken')

router.post('/make-payment',async(req,res)=>{
    const { bookingId, mode } = req.body;

    try {
        const booking = await bookModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found!" });
        }

        const transactionNumber = `TRXN${Math.floor(Math.random() * 1000000)}`;
        const status = mode === 'credit card' ? 'paid' : 'to be paid';

        const payment = new paymentModel({
            bookingId,
            amount:booking.amount,
            status,
            mode,
            transactionNumber,
        });

        await payment.save();
        

        res.status(201).json({ payment });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.get('/user-payments', validateToken, async (req, res) => {
    try {
        const userId = req.user._id;
        
        const bookings = await bookModel.find({ userId });

        
        const bookingIds = bookings.map(booking => booking._id);

        
        const payments = await paymentModel.find({ bookingId: { $in: bookingIds } });

        if (!payments.length) {
            return res.status(404).json({ message: "No payments found for this user." });
        }

        res.status(200).json({ data: payments, message: "Payments fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
