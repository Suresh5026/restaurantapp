const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const {connectMongodb} = require('./Database/db')
const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;

const app =express();
connectMongodb();
app.use(bodyParser.json()); 
app.use(cors({
    origin: 'https://ubiquitous-mousse-e69a4f.netlify.app', 
    credentials: true
}));
app.use('/user',require('./Models/userController'));
app.use('/restaurants',require('./Models/resController'));
app.use('/book',require('./Models/bookController'));
app.use('/payment',require('./Models/paymentController'));

app.get("/",(req,res)=>{
    res.send("Server running success!!!")
});

app.listen(PORT,HOSTNAME,()=>{
    console.log(`Server is running on PORT ${PORT}`);
}
)