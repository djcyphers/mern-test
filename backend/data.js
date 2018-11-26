// Schema && Data Configuration
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// DB Structure
const DataSchema = new Schema(
    { id: Number, message: String },
    { timestamps: true }
);

// Export new Schema for NodeJS
module.exports = mongoose.model("Data", DataSchema);