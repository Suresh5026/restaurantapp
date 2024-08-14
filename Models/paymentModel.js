const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,  
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      default: "created",  
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: Map,
      of: String,
    },
    paymentId: {
      type: String,
      required: false,
    },
    paymentStatus: {
      type: String,
      required: false,
      enum: ["pending", "completed", "failed"],  
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bookings",
      required: false,
    },
  },
  { timestamps: true }
);

const paymentModel = mongoose.model("payments", paymentSchema);

module.exports = paymentModel;
