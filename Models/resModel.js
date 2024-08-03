const mongoose = require('mongoose');

const resSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    city : {
        type :String,
        required : true
    },
    features : {
        type : [String],
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    menu : [{
        type : String,
        required : true
    }],
    cuisines : {
        type : [String],
        required : true
    },
    timing : {
        type : [String],
        required : true
    },
    buckets : {
        type : String,
        required : true
    },
    ratings : {
        type : Number,
        required : true
    }


},{ timestamps : true })

const restModel = mongoose.model("restaurants",resSchema);
module.exports = restModel