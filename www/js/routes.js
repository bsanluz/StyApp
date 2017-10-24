angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.closet', {
    url: '/closet',
    views: {
      'tab1': {
        templateUrl: 'templates/closet.html',
        controller: 'closetCtrl'
      }
    }
  })

  .state('tabsController.lojas', {
    url: '/lojas',
    views: {
      'tab2': {
        templateUrl: 'templates/lojas.html',
        controller: 'lojasCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('cadastro', {
    url: '/cadastro',
    templateUrl: 'templates/cadastro.html',
    controller: 'cadastroCtrl'
  })

  .state('detalhes', {
    url: '/detalhes',
    templateUrl: 'templates/detalhes.html',
    controller: 'lojasCtrl'
  })
  .state('mapa', {
    url: '/mapa',
    templateUrl: 'templates/mapa.html',
    controller: 'lojasCtrl'
  })

$urlRouterProvider.otherwise('/login')

  

});