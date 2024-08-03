const express = require('express');
const router = express.Router();
const bookModel =require('../Models/bookModel');
const restModel =  require('../Models/resModel');
const userModel = require('../Models/userModel');
const validateToken = require('../middleWares/validateToken');

// Create a new booking
router.post('/create-booking', async (req, res) => {
    try{
        const {  name,guests, amount,  date, resname, restId,userId } = req.body;
    const rest =  await restModel.findById(restId);
    if(!rest){
        return res.status(404).json({ message: "Restaurant not found" });
    }
    const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

    const newBooking  = new bookModel({
        name,
        guests,
        amount,
        date,
        resname,
        restId : rest._id,
        userId : user._id
    });
    await newBooking.save();
    res.status(201).json(newBooking);
    }catch (error){
        res.status(500).json({ message: error.message });
    }
});

//update booking
router.put('/update-booking-payment/:_id', validateToken, async (req, res) => {
    try {
      const bookingId = req.params._id;
      const { transactionNumber } = req.body;
  
      const booking = await bookModel.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
  
      booking.status = 'Paid';
      booking.transactionNumber = transactionNumber;
      await booking.save();
  
      res.status(200).json({ message: "Payment updated", booking });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  module.exports = router;

// Cancel booking
router.put('/cancel-booking/:_id',validateToken, async (req, res) => {
  try {
    const bookingId = req.params._id
    const booking = await bookModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = 'Cancelled'; 
    await booking.save();

    res.status(200).json({ message:"Cancelled",booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/get-bookings",validateToken,async(req,res)=>{
    try{
        const userId =req.user._id;
        const bookings = await bookModel.find({ userId  });
        if(!bookings.length){
            return res
        .status(404)
        .json({ message: "No bookings found for this user." });
        }
        return res.json({
            data: bookings,
            message: "Bookings fetched successfully",
          });

    }catch(error){
        return res.status(500).json({ message: error.message });
    }
})
router.get('/booking/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await bookModel.findById(id).populate('userId', 'name email');
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json({ booking });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
