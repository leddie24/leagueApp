app.factory('ChampFactory', function($http) {
   var factory = {};

   factory.getChamps = function(callback) {
      $http.get('/getchamps').then(
      function (response) {
         console.log(response);
         callback(response.data);
      })
      .catch(function (response) {
         console.log('err', response);
      });
   }

   factory.getChampInfo = function(id, callback) {
      console.log(id, 'id is');
      $http.get('/getchampinfo/' + id).then(
      function (response) {
         console.log(response);
         callback(response.data);
      })
      .catch(function (response) {
         console.log('err', response);
      });
   }

   return factory;
});