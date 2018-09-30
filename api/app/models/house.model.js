const mongoose = require('mongoose');

const HouseSchema = mongoose.Schema({
    externalId: String,
    address: String,
    currentPrice: String,
    pictureUrl: String,
    listingUrl: String,
    status: String,
    rank: Number,
    priceHistory: [{
      priceDate: String,
      price: String,
    }],
    tags: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('House', HouseSchema);
