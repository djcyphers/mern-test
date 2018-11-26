// Express Server, Mongoose (MongoDB), bParser (json), Morgan, Data
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require ("./data");
const API_PORT = 3001;
const app = express();
const router = express.Router();

// MongoDB Database
const dbRoute = "mongodb://djcyphers:unusualteapot1@ds239412.mlab.com:39412/cyphers-db";

// Connect to backend code with the db
mongoose.connect(
    dbRoute,
    { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("Connected to Database"));

// Check connection to db
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// bodyParser for readable JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// Create method for db
router.post("/putData", (req, res) => {
    let data = new Data();

    const { id, message } = req.body;

    if ((!id && id !== 0) || !message) {
        return res.json({
        success: false,
        error: "INVALID INPUTS"
        });
    }
    data.message = message;
    data.id = id;
    data.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

// Get method for db
router.get("/getData", (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data});
    });
});

// Update method for db
router.post("/updateData", (res, req) => {
    const { id, update } = req.body;

    Data.findOneAndUpdate(id, update, err => {
        if (err) return res.json({success: false, error: err });
        return res.json({ success: true });
    });
});

// Delete method for db
router.delete("/deleteData", (req, res) => {
    const { id } = req.body;
    
    Data.findOneAndDelete(id, err => {
        if (err) return res.send(err);
        return res.json({ success: true });
    });
});

var port = process.env.port || 3001;
app.listen(port);

// append api for our http requests
app.use("/api", router);