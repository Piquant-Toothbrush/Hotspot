// Required modules to handle Yelp's oAuth requirement
import oauthSignature from 'oauth-signature';
import n from 'nonce';
import request from 'request';
import qs from 'querystring';
import _ from 'lodash';
import Promise from 'bluebird';

// Import sercet API keys (All 4 are needed)
// cant import from non existant file in deployment
// import Y from '../config-public/yelpconfig';
// import Y from '../config/yelpconfig';
const YELP_CONSUMER_KEY='TMXpPB0Cfc1STQaeBf6wKQ'
const YELP_CONSUMER_SECRET='NnxsLL9_Kel_Ls0mImLOQXHaMuk'
const YELP_TOKEN='CqzYbfwlIM1m_N-YE3Urj0D1fDexctdw'
const YELP_TOKEN_SECRET='PME0iUho7N-bLpt7G2MBZ6UdrVI'




// Yelp Endpoints
var endpointNewPlace = 'https://api.yelp.com/v2/search';
var endpointBusID = 'https://api.yelp.com/v2/business/';

// Generate parameters for a new business
export var generateYelpNewBusParam = function (name, longitude, latitude) {
  console.log('generateYelpNewBusParam called')
  return {
    term: name,
    limit: 1,
    ll: latitude + ',' + longitude
  };
};

// Yelp call
export var requestYelp = function (setParameters, busId, searchBar) {
  console.log('requestYelp called')
  var httpMethod = 'GET';

  if (busId) {
    var url = endpointBusID + setParameters;
  } else {
    var url = endpointNewPlace;
  }

  var defaultParameters = {};

  var requiredParameters = {
    oauth_consumer_key: YELP_CONSUMER_KEY,
    oauth_token: YELP_TOKEN,
    oauth_nonce: n()(),
    oauth_timestamp: n()().toString().substr(0, 10),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0'
  };

  if (busId) {
    var parameters = _.assign(requiredParameters);
  } else {
    var parameters = _.assign(setParameters, requiredParameters);
  }

  var consumerSecret = YELP_CONSUMER_SECRET;
  var tokenSecret = YELP_TOKEN_SECRET;
  // Call Yelp servers for a oAuth signature (only good for 300 sec)
  var signature = oauthSignature.generate(
    httpMethod,
    url,
    parameters,
    consumerSecret,
    tokenSecret,
    {encodeSignature: false}
  );

  parameters.oauth_signature = signature;
  console.log('parameters', parameters);
  var paramUrl = qs.stringify(parameters);

  var apiUrl = url + '?' + paramUrl;

  return new Promise((resolve, reject) => {
    // console.log(apiUrl);
    request(apiUrl, function(err, res, body) {
      // console.log('yelp res', res);
      if (err) {
        console.log('**********************************');
        console.log('ERROR', err);
        reject(err);
      }

      var data = JSON.parse(body);
      // console.log('returning data', data);
      if (busId) {
        resolve(parseYelpData(data));
      } else if (data.businesses.length > 0) {
        if (searchBar) {
          resolve(data.businesses.map(business => parseYelpData(business)));
        } else {
          resolve(parseYelpData(data.businesses[0]));
        }
      } else {
        resolve();
      }
    });
  });

};

// Multiple requests for businessId array
export var requestMultipleYelp = function(yelpParams) {
  return Promise.all(yelpParams.map((yelpParam) => {
    return requestYelp(yelpParam);
  }));
  // busIds.forEach(function(busId) {
  //   requestYelp(busId, true)
  //   .then((data) => {
  //     compiledData.push(data);
  //     if (compiledData.length === busIds.length) {
  //       compiledData;
  //     }
  //   });
  // });
};

// Parse required data out of Yelp's response data
export var parseYelpData = function (business) {
  console.log('business',business);
  let cuisine;
  if (business.categories && business.categories[0]) {
    cuisine = business.categories[0][0];
  } else {
    cuisine = 'food';
  }
  var imageUrl = business.image_url;
  var businessId = business.id;
  var parsed = {
    name: business.name,
    cuisine: cuisine,
    image: imageUrl,
    businessId: businessId,
    latitude: business.location.coordinate.latitude,
    longitude: business.location.coordinate.longitude
  };

  return parsed;
};
