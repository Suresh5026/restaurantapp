const express = require("express");
const router = express.Router();
const paymentModel = require("../Models/paymentModel");
const bookModel = require("../Models/bookModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const validateToken = require("../middleWares/validateToken");

let instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

router.post("/orders", async (req, res) => {
  try {
    const { userId, bookingId, amount } = req.body;
    console.log(userId,bookingId,amount);
    
    const options = {
      amount: amount*100,
      currency: "INR",
      notes: {
        userId: userId,
        bookingId: bookingId,
      },
    };

    console.log(options);
    
    instance.orders.create(options, async (err, order) => {
      if (err) {
        return res.status(500).json({ message: "Server Error", error: err });
      }

      const newOrder = new paymentModel({
        orderId: order.id,
        userId: userId,
        bookingId:bookingId,
        amount: order.amount,
        currency: order.currency,
        notes: order.notes,
        status: order.status,
      });
      await newOrder.save();

      return res.status(200).json({
        data: order,
        message: "Order Created Successfully",
      });
    });
  } catch {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/verify', async (req, res) => {
    const { response, bookingId } = req.body;
  console.log(req.body.bookingId);
  
    
    const body = response.razorpay_order_id + "|" + response.razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(body.toString())
      .digest("hex");
  
    
    if (expectedSignature === response.razorpay_signature) {
      console.log("Signature verified successfully");
  
      try {
        const result = await bookModel.updateOne(
          { _id: bookingId },
          { $set: { paymentStatus: "Paid" } }
        );
  
        if (result.modifiedCount > 0) {
          console.log("Payment status updated successfully.");
          res.json({ success: true, message: "Payment verification successful" });
        } else {
          console.log("No matching document found or status already updated.");
          res.json({
            success: false,
            message: "No matching document found or status already updated.",
          });
        }
      } catch (error) {
        console.error("Database update failed:", error);
        res.status(500).json({
          success: false,
          message: "Database update failed",
          error: error.message,
        });
      }
    } else {
      console.error("Invalid signature");
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  });

module.exports = router;
