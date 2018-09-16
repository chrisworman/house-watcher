const realtor = require('realtorca');
const http = require('http');

processPage(1);

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

  console.log( realtor.buildUrl(opts) );

  realtor.post(opts)
    .then(data => {
        let responseObj = JSON.parse(JSON.stringify(data));

        //map obj to api domain model
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
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  console.log(propertyJson);
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
      pictureUrl: obj.Results[i].Property.Photo[0].HighResPath,  //add if statement
      listingUrl: 'https://www.realtor.ca/' + obj.Results[i].RelativeDetailsURL,
    });
  }

  //testing
  console.log('Property harvest count: ' + properties.length);

  return properties;

}
