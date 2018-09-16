module.exports = (app) => {
    const houses = require('../controllers/house.controller.js');
    app.get('/houses', houses.findAll);
    app.get('/houses/:externalId', houses.findOneByExternalId);
    app.put('/houses', houses.upsert);
    app.put('/houses/:externalId/status/:status', houses.setStatus);
    app.put('/houses/:externalId/rank/:rank', houses.setRank);
    app.delete('/houses/:houseId', houses.delete);
}
