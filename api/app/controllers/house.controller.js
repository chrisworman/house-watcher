const House = require('../models/house.model.js');

// Upsert a house
exports.upsert = (req, res) => {

  console.log(req.body);

  // Validate
  if(!req.body) {
    return res.status(400).send({
        message: "Malformed HTTP body"
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
        status: "new",
        priceHistory: [],
      });
    } else {
      console.log('found house');
      house.externalId = req.body.externalId;
      house.address = req.body.address;
      house.currentPrice = req.body.currentPrice;
      house.pictureUrl = req.body.pictureUrl;
      house.listingUrl = req.body.listingUrl;
      house.status = req.body.status ? req.body.status : house.status;

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
            message: err.message || "Error creating house"
        });
    });

  });
};

exports.setStatus = (req, res) => {

  console.log("Setting status of " + req.params.externalId);

  House.findOne({ externalId: req.params.externalId }, function (err, house) {

    if (err) {
      return res.status(500).send({
          message: "Server error: " + err.toString()
      });
    }

    if (!house) {
      return res.status(404).send({
          message: "House " + externalId + " not found: " + err.toString()
      });
    }

    house.status = req.params.status;
    house.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error setting house status."
        });
    });

  });

};

// Retrieve and return all houses from the database.
exports.findAll = (req, res) => {
  House.find()
    .then(houses => {
        res.send(houses);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error retrieving houses."
        });
    });
};

// Find a single house with a houseId
exports.findOneByExternalId = (req, res) => {
  House.findById(req.params.externalId)
      .then(house => {
          if(!house) {
              return res.status(404).send({
                  message: "House not found with id " + req.params.externalId
              });
          }
          res.send(house);
      }).catch(err => {
          if(err.kind === 'ObjectId') {
              return res.status(404).send({
                  message: "House not found with id " + req.params.externalId
              });
          }
          return res.status(500).send({
              message: "Error retrieving house with id " + req.params.externalId
          });
      });
};

// Delete a house with the specified houseId in the request
exports.delete = (req, res) => {

};
