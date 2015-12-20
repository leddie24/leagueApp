app.controller('homeController', function($scope, ChampFactory) {
   var mv = this; 

   mv.index = function() {
      ChampFactory.getChamps(function(data) {
         console.log(data);
         mv.champs = data;
         //console.log(mv.champs);
      })
   }

   mv.index();
});