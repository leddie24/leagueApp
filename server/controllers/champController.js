var request = require('request');
var NodeCache = require( "node-cache" );
var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(50, 'minute', true);
var myCache = new NodeCache();
var apiKey = '2db9e35c-3df4-45ea-8b14-2d44f051f5e6';

function getChamp(id, properties, callback) {
   var props = properties.join(',');
   props = props.replace(/\s/g, '');
   request.get('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/' + id + 
      "?champData=" + props + "&api_key=" + apiKey, function (error, response, body) {
      if (error) {
         console.log(error, 'error getting static champ info');
      } else {
         console.log(response.statusCode);
         if (response.statusCode != 404) {
            callback(JSON.parse(response.body));
         } else {
            console.log('champ not found');
         }
      }
   });
}

module.exports = {
   getChamps: function(req, res) {
      myCache.get( "freeChamps", function (err, value) {
         if( !err ){
            // Free champs are not in cache, get new ones
            if (value == undefined) {
               limiter.removeTokens(1, function (err, remainingRequests) {
                  console.log(remainingRequests);

                  //Remove a token, if remaining requests is 0, return http response 429
                  if (remainingRequests < 0) {
                     console.log('no more requests');
                     res.status(429).set('Content-Type', 'text/plain;charset=UTF-8');
                     res.end('429 Too Many Requests - your IP is being rate limited');
                  } else {
                     // We have enough tokens, query Riot API
                     console.log('not found, set free champs in cache');
                     request.get('https://na.api.pvp.net/api/lol/na/v1.2/champion?freeToPlay=true&api_key=' + apiKey, function(error, response, body) {
                        if (error) {
                           console.log(error, 'error getting champs');
                        } else {
                           var champInfo = [];
                           var jsonobj = JSON.parse(response.body);
                           function getInfo() {
                              var cInfo = jsonobj.champions.shift();
                              getChamp(cInfo.id, ['spells'], function(data) {
                                 champInfo.push(data);
                                 if (jsonobj.champions.length > 0) {
                                    getInfo();
                                 } else {
                                    // Set free champs in cache, expire in 1 day
                                    myCache.set( "freeChamps", champInfo, 86400, function( err, success ){
                                      if( !err && success ){
                                        console.log( success );
                                      }
                                    });
                                    // Send champ info
                                    res.json(champInfo);
                                 }
                              })
                           }
                           getInfo();
                        }
                     });
                  }
               });
            } else {
               // Return cached champions
               console.log('return cached champions');
               res.json( value );
            }
        }
      });
   },
   getChampInfo: function(req, res) {
      // Get specific champ info from cache
      myCache.get( "champInfo" + req.params.id, function (err, value) {
         if (!err){
            // Not in cache, add champ info to cache
            if (value == undefined) {
               console.log('key not found');

               var champInfo = null;
               var properties = ['passive', 'skins', 'spells', 'stats', 'info'];
               getChamp(req.params.id, properties, function(data) {
                  champInfo = data;
                  myCache.set("champInfo" + req.params.id, champInfo, 86400, function (err, success) {
                     if( !err && success ){
                        console.log( success );
                        console.log('got champ info and cached it', champInfo.name);
                        res.json(champInfo);
                     } else {
                        console.log(err);
                     }
                  });
               })
            } else {
               // Return champ info from cache
               console.log('cached info for champ ', value.name);
               res.json(value);
            }
         }
      });
   }
}