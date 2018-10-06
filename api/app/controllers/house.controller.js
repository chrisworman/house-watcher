const House = require('../models/house.model.js');

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
      console.log('Creating a new house');
      // Create a House
      house = new House({
        externalId: req.body.externalId,
        address: req.body.address,
        currentPrice: req.body.currentPrice,
        pictureUrl: req.body.pictureUrl,
        listingUrl: req.body.listingUrl,
        status: "new",
        rank: req.body.rank ? req.body.rank : 0,
        priceHistory: [],
        tags: [],
        deleted: false
      });
    } else {
      console.log('Updating existing house');
      house.externalId = req.body.externalId;
      house.address = req.body.address;
      house.currentPrice = req.body.currentPrice;
      house.pictureUrl = req.body.pictureUrl;
      house.listingUrl = req.body.listingUrl;
      house.status = req.body.status ? req.body.status : house.status;
      house.rank = req.body.rank ? req.body.rank : house.rank;
      house.tags = req.body.tags ? req.body.tags : house.tags;

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

exports.delete = (req, res) => {

  House.findOne({'externalId':req.params.externalId}).then(house => {

    if(!house) {
      return res.status(404).send({
          message: "House not found with id " + req.params.externalId
      });
    }

    house.deleted = true;

    house.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error deleting house."
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
          message: "House " + req.params.externalId + " not found: " + err.toString()
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

exports.setRank = (req, res) => {

  console.log("Setting rank of " + req.params.externalId);

  House.findOne({ externalId: req.params.externalId }, function (err, house) {

    if (err) {
      return res.status(500).send({
          message: "Server error: " + err.toString()
      });
    }

    if (!house) {
      return res.status(404).send({
          message: "House " + req.params.externalId + " not found: " + err.toString()
      });
    }

    house.rank = req.params.rank;
    house.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error setting house rank."
        });
    });

  });

};

exports.putTag = (req, res) => {

  const queryTag = req.params.tag.toString().toLowerCase();

  House.findOne({ externalId: req.params.externalId }, function (err, house) {

    if (err) {
      return res.status(500).send({
          message: "Server error: " + err.toString()
      });
    }

    if (!house) {
      return res.status(404).send({
          message: "House " + req.params.externalId + " not found: " + err.toString()
      });
    }

    house.tags = house.tags || [];
    queryTag.split(',').map((t) => t.trim()).map((t) => {
      if (t && t.length && house.tags.indexOf(t) < 0) { // new tag
        house.tags.push(t);
      }
    });

    house.tags.sort();

    house.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error putting house tag."
        });
    });

  });

};

exports.deleteTag = (req, res) => {

  const tag = req.params.tag.toString().toLowerCase();

  console.log("Deleting tag " + tag);

  House.findOne({ externalId: req.params.externalId }, function (err, house) {

    if (err) {
      return res.status(500).send({
          message: "Server error: " + err.toString()
      });
    }

    if (!house) {
      return res.status(404).send({
          message: "House " + req.params.externalId + " not found: " + err.toString()
      });
    }

    house.tags = house.tags || [];
    var tagIndex = house.tags.indexOf(tag);
    if (tagIndex >= 0) { // tag exists
      house.tags.splice(tagIndex, 1); // remove tag
    }

    house.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error putting house tag."
        });
    });

  });
};

exports.findAll = (req, res) => {
  House.find()
    .then(houses => {
        res.send(houses.filter((h) => !h.deleted));
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error retrieving houses."
        });
    });
};
