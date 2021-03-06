const uiModules = require('ui/modules');

import uiRoutes from 'ui/routes';
import  _ from "lodash";
import 'ui/autoload/styles';
import template from './templates/index.html';

uiRoutes.enable();
uiRoutes
    .when('/', {
        template: template,
        controller: 'createIndexPattern',
        controllerAs: 'ctrl'
    })

uiModules
    .get('app/patternizer', [])
    .controller('createIndexPattern', function ($scope, $location, $route, $interval, $http) {
        $scope.title = 'Patternizer';
        $scope.finishLoad = false;
        $scope.description = 'Patternizer';
        $scope.icon = "";

        $scope.location = $location;
        $scope.$watch('location.search()', function() {
            $scope.target = ($location.search()).target;
        }, true);

        $scope.changeTarget = function(name) {
            $location.search('target', name);
        }

        $scope.init = function () {
          var baseurl = $location.$$absUrl.split('/app')[0]
          $scope.target = ($location.search()).target;
          var request = {'timeFieldName': '@timestamp', 'title': $scope.target};
          var patternId = ""
          $http.post('../api/getIndexDocumentCount', request).then((response) => {
              if(typeof $scope.target === 'undefined') {
                  $scope.welcomemessage = 'Welcome to Patternizer'
                  $scope.link = 'click here to create a new index pattern'
              } else{
                  if(response.data.count > 0){
                   $http.post('../api/getIndexPattern', request).then((response, error) => {
                     $scope.count = response.data.hits.total;
                     $scope.found = $scope.count > 0 ? true : false;
                     $scope.indextarget = 'Index pattern ' + $scope.target
                     $scope.link = 'click here'
                     if($scope.count > 0){
                       patternId = response.data.hits.hits[0]._id
                       alert(patternId)
                       $http.post('../api/getShortUrl', request).then((response) => {
                         $scope.urlfound = response.data.found;
                         if($scope.urlfound){
                           window.location.href=baseurl + "/goto/shorturl" + $scope.target
                         }
                         if(typeof $scope.urlfound === 'undefined'){
                           var createUrlReq = {'timeFieldName': '@timestamp', 'title': patternId.substring(14)}
                           $http.post('../api/createShortUrl', createUrlReq).then((response) => {
                             window.location.href=baseurl + "/goto/shorturl" + $scope.target
                           });
                         }
                       });
                     }else{
                       $scope.message = 'does not exist'
                       $scope.createmessage = 'to create one'
                     }
                  });
                 } else {
                    $scope.welcomemessage = 'Index does not have data, please retry again after sending data'
                 }
              }
         });
      }

      $scope.createPattern = function () {
        var baseurl = $location.$$absUrl.split('/app')[0]
        var request = {'timeFieldName': '@timestamp', 'title': $scope.target};
        if(typeof $scope.target === 'undefined') {
          window.location.href=baseurl + "/app/kibana#/management/kibana/indices"
        } else {
          if($scope.found){
            $http.post('../api/getShortUrl', request).then((response) => {
              $scope.urlfound = response.data.found;
              if($scope.urlfound){
                window.location.href=baseurl + "/goto/shorturl" + $scope.target
              }
              if(typeof $scope.urlfound === 'undefined'){
                $http.post('../api/createShortUrl', request).then((response) => {
                  window.location.href=baseurl + "/goto/shorturl" + $scope.target
                });
              }
            });
          }else{
            $http.post('../api/createIndexPattern', request).then((response) => {
              $http.post('../api/getShortUrl', request).then((response) => {
                $scope.urlfound = response.data.found;
                if($scope.urlfound){
                  window.location.href=baseurl + "/goto/shorturl" + $scope.target
                }
                if(typeof $scope.urlfound === 'undefined'){
                  $http.post('../api/createShortUrl', request).then((response) => {
                    window.location.href=baseurl + "/goto/shorturl" + $scope.target
                  });
                }
              });
            });
          }
        }
      }
});
