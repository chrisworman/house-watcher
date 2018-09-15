module.exports = (app) => {
    const houses = require('../controllers/house.controller.js');
    app.get('/houses', houses.findAll);
    app.get('/houses/:externalId', houses.findOneByExternalId);
    app.put('/houses', houses.upsert);
    app.delete('/houses/:houseId', houses.delete);
}
