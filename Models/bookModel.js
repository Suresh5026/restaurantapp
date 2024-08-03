const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    date :{
        type : Date,
        required :true,
        default : Date.now
    },
    name : {
        type : String,
        required : true
    },
    resname : {
        type : String,
        required : true
    },
    guests : {
        type : Number,
        required : true,
        default :  2
    },
    amount : {
        type : Number,
        required :true
    },
    userId: {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
  
      },
      restId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurants',
        required: true,
      },
      status : {
        type : String,
        enum : ["Booked","Cancelled","Paid","To Be Paid"],
        default : "Booked"
      }

},{timestamps : true})

const bookModel = mongoose.model("bookings",bookSchema);
module.exports = bookModel;
