const mongoose = require('mongoose');

const vgSchema = new mongoose.Schema({
    title: {type: String, required: true},
    genre: {type: String, required: true},
    developers: {type: String, required: true},
    sales: {type: Number, required: true},
})

module.exports = mongoose.model("VideoGames", vgSchema);