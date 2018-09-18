const realtor = require('realtorca');
const http = require('http');

module.exports = {
    scrape: function(){
        processPage(1);
    }
}

function processPage(pageNumber){
  console.log("Processing pageNumber: " + pageNumber.toString());

  let opts = {
    PriceMin: 350000,
    PriceMax: 650000,
    LongitudeMin: -119.87218099755859,
    LongitudeMax: -119.1148110024414,
    LatitudeMin: 49.8283700750105,
    LatitudeMax: 49.938978568504204,
    BuildingTypeId: 1,
    OwnershipTypeGroupId: 1,
    CurrentPage: pageNumber
  };

  realtor.post(opts)
    .then(data => {
        let responseObj = JSON.parse(JSON.stringify(data));
        let properties = mapResponseToModel(responseObj);

        properties.forEach(function(property){
          console.log('Sending property: ' + property.externalId);
          sendRequest(property);
        });

        if(properties.length > 0){
          processPage(pageNumber+1);
        }
    })
    .catch(err => {
      console.log(err);
    });
}

function sendRequest(property){

  const propertyJson = JSON.stringify(property);

  var options = {
    host: 'localhost',
    port: 3000,
    path: '/houses',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.write(propertyJson);
  req.end();

  console.log('--------Request sent---------');

}

function mapResponseToModel(obj){

  let properties = [];
  for(i = 0; i < obj.Results.length; i++){
    properties.push({
      externalId: obj.Results[i].MlsNumber,
      address: obj.Results[i].Property.Address.AddressText,
      currentPrice: obj.Results[i].Property.Price,
      pictureUrl: obj.Results[i].Property.Photo.length > 0 ? obj.Results[i].Property.Photo[0].HighResPath : null,
      listingUrl: 'https://www.realtor.ca/' + obj.Results[i].RelativeDetailsURL,
    });
  }

  return properties;
}
