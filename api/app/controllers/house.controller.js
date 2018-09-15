const House = require('../models/house.model.js');

// Upsert a house
exports.upsert = (req, res) => {

  console.log(req.body);

  // Validate
  if(!req.body) {
      return res.status(400).send({
          message: "Empty body"
      });
  }

  // Check for existing house
  House.findOne({ externalId: req.body.externalId }, function (err, house) {
    if (err) {
      return res.status(500).send({
          message: "Server error: " + err.toString()
      });
    }

    if (!house) {
      console.log('creating a new house');
      // Create a House
      house = new House({
        externalId: req.body.externalId,
        address: req.body.address,
        currentPrice: req.body.currentPrice,
        pictureUrl: req.body.pictureUrl,
        listingUrl: req.body.listingUrl,
        priceHistory: [],
      });
    } else {
      console.log('found house');
      house.externalId = req.body.externalId;
      house.address = req.body.address;
      house.currentPrice = req.body.currentPrice;
      house.pictureUrl = req.body.pictureUrl;
      house.listingUrl = req.body.listingUrl;

      // New price?
      if (house.priceHistory.length === 0 ||
          house.priceHistory[house.priceHistory.length-1].price !== house.currentPrice) {
        house.priceHistory.push({
          priceDate: new Date().toISOString(),
          price: req.body.currentPrice,
        });
      }

    }

    // Save House in the database
    house.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error creating house."
        });
    });

  });
};


// Retrieve and return all houses from the database.
exports.findAll = (req, res) => {

};

// Find a single house with a houseId
exports.findOneByExternalId = (req, res) => {
  House.findById(req.params.externalId)
      .then(house => {
          if(!note) {
              return res.status(404).send({
                  message: "House not found with id " + req.params.externalId
              });
          }
          res.send(note);
      }).catch(err => {
          if(err.kind === 'ObjectId') {
              return res.status(404).send({
                  message: "House not found with id " + req.params.externalId
              });
          }
          return res.status(500).send({
              message: "Error retrieving note with id " + req.params.externalId
          });
      });
};

// Update a house identified by the houseId in the request
exports.update = (req, res) => {

};

// Delete a house with the specified houseId in the request
exports.delete = (req, res) => {

};
