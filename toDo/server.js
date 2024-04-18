const express = require("express");
const mongoose = require("mongoose");
const {config} = require('dotenv');
const path = require("path")
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require('body-parser');
const usersRouter = require("./routes/users");
config();

const app = express();
app.use(express.json());


app.use(cookieParser())

mongoose.connect('mongodb+srv://jpotlapa:test123@cluster0.cumdisy.mongodb.net/website?retryWrites=true&w=majority&appName=Cluster0',{
    useNewUrlParser:true,
});

const db = mongoose.connection;

db.on('error', err => {
    console.log(err);
});

db.once("open",()=>console.log("connected in server"));

app.use("/users",usersRouter);



app.listen(5800,()=>{
    console.log(`Server has started on 5800`);
});