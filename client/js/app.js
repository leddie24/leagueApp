var app = angular.module('leagueApp', ['ui.router', 'ui.router.stateHelper', 'ngSanitize']);

app.config(function ($urlRouterProvider, stateHelperProvider) {
   stateHelperProvider
      .state({
         name: 'home',
         url: '/',
         templateUrl: './partials/home.html',
         controller: 'homeController as hc'
      })
      .state({
         name: 'champView',
         url: '/champ/:id',
         templateUrl: './partials/champview.html',
         controller: 'champController as cc'
      })

      $urlRouterProvider.otherwise('/');
});

app.directive('slider', function($timeout) {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      images: '='
    },
    link: function(scope, elem, attrs) {},
    templateUrl: './templates/slider.html'
  };
});