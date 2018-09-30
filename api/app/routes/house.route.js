module.exports = (app) => {
    const houses = require('../controllers/house.controller.js');

    // house
    app.put('/houses', houses.upsert);
    app.get('/houses', houses.findAll);
    app.get('/houses/:externalId', houses.findOneByExternalId);

    // status
    app.put('/houses/:externalId/status/:status', houses.setStatus);

    // rank
    app.put('/houses/:externalId/rank/:rank', houses.setRank);

    // tags
    app.put('/houses/:externalId/tags/:tag', houses.putTag);
    app.delete('/houses/:externalId/tags/:tag', houses.deleteTag);
}
