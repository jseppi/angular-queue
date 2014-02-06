/**
* Angular Queue
* @version v0.0.0
* @author James Seppi
* @license MIT License, http://jseppi.mit-license.org
*/
(function(window, angular, undefined) {
'use strict';

angular.module('ngQueue', []).factory('$queue',
    ['$timeout',
    function($timeout) {

        var defaults = {
            callback: null,
            delay: 100,
            complete: null
        };

        function Queue(options) {
            options = angular.extend({}, defaults, options);

            if (!options.callback || !angular.isFunction(options.callback)) {
                throw new Error('options.callback must be a function');
            }

            /* Private variables */
            var cleared = false,
                paused = options.paused,
                timeoutProm = null;

            /* Public variables */
            this.queue = [];
            this.delay = options.delay;
            this.callback = options.callback;
            this.complete = options.complete;

            /* Privileged/Public methods */
            this.size = function() {
                return this.queue.length;
            };

            this.add = function(item) {
                return this.addEach([item]);
            };

            this.addEach = function(items) {
                if (items) {
                    cleared = false;
                    this.queue = this.queue.concat(items);
                }

                if (!paused) { this.start(); }

                return this.size();

            };

            this.clear = function() {
                var orig = this.queue;
                this.stop();
                this.queue = [];
                cleared = true;
                return orig;
            };

            this.pause = function() {
                this.stop();
                paused = true;
            };

            this.stop = function() {
                if (timeoutProm) {
                    $timeout.cancel(timeoutProm);
                }

                timeoutProm = null;
            };

            this.start = function() {
                var _this = this;
                paused = false;
                if (this.size() && !timeoutProm) {
                    (function loopy() {
                        var item;

                        _this.stop();

                        if (!_this.size()) {
                            cleared = true;
                            if (angular.isFunction(_this.complete)) {
                                _this.complete.call(_this);
                            }
                            return;
                        }

                        item = _this.queue.shift();
                        _this.callback.call(_this, item);

                        timeoutProm = $timeout(loopy,
                            _this.delay);

                        return;
                    })();
                }
            };

            this.indexOf = function(item) {
                if (this.queue.indexOf) return this.queue.indexOf(item);

                for (var i = 0; i < this.queue.length; i++) {
                    if (item === this.queue[i]) return i;
                }
                return -1;
            };
        }

        // angular.extend(Queue.prototype, {

        //     //initialize: function() { }
        // });

        Queue.queue = function(options) {
            return new Queue(options);
        };

        return Queue;
    }]);

})(window, window.angular);