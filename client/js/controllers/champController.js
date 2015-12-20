app.controller('champController', function($scope, $stateParams, ChampFactory) {
   var mv = this; 

   console.log($stateParams);
   mv.getChamp = function() {
      ChampFactory.getChampInfo($stateParams.id, function(data) {
         mv.champinfo = data;
      });
   }

   mv.getChamp();
});