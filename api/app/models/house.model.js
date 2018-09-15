const mongoose = require('mongoose');

const HouseSchema = mongoose.Schema({
    externalId: String,
    address: String,
    currentPrice: String,
    pictureUrl: String,
    listingUrl: String,
    priceHistory: [{
      priceDate: String,
      price: String,
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('House', HouseSchema);
