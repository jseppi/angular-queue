/**
* Angular Queue
* @version v0.0.0
* @author James Seppi
* @license MIT License, http://jseppi.mit-license.org
*/
(function(window, angular, undefined) {
'use strict';

angular.module('ngQueue', []).factory('$queue',
    ['$filter', '$parse',
    function($filter, $parse) {

        function Queue(options) {
            options = options || {};
            this.initialize.apply(this, arguments);
        }

        angular.extend(Queue.prototype, {
            initialize: function() {
                console.log("hi james!");
            }

        });

        Queue.instance = function(options) {
            return new Queue(options);
        };

        return Queue;
    }]);

})(window, window.angular);