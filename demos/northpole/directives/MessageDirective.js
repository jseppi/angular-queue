'use strict';

angular.module('northpole.directives')
    .directive("message", 
        ['$compile', '$rootScope',
        function ($compile, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: './templates/messageTemplate.html',
            replace: true,
            scope: {
          		toymodel: '='
        	},
            controller: "MessageViewController",
            link: function(scope, element, attributes) {

                scope.init();

                /*
                scope.$watch('toymodel', function() {
                    $compile(element.contents())(scope);
                });
                */
           }
        };
}]);