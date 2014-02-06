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

        /**
         * Implementation of the Queue class
         *
         */
        function Queue(options) {
            options = angular.extend({}, defaults, options);

            if (!options.callback || !angular.isFunction(options.callback)) {
                throw new Error('options.callback must be a function');
            }

            //-- Private variables
            var cleared = false,
                paused = options.paused,
                timeoutProm = null;

            //-- Public variables
            this.queue = [];
            this.delay = options.delay;
            this.callback = options.callback;
            this.complete = options.complete;

            //-- Privileged/Public methods

            /**
             * size() returns the size of the queue
             *
             * @return<Number> queue size
             */
            this.size = function() {
                return this.queue.length;
            };

            /**
             * add() adds an item to the back of the queue
             *
             * @param<Object> item
             * @return<Number> queue size
             */
            this.add = function(item) {
                return this.addEach([item]);
            };

            /**
             * addEach() adds an array of items to the back of the queue
             *
             * @param<Array> items
             * @return<Number> queue size
             */
            this.addEach = function(items) {
                if (items) {
                    cleared = false;
                    this.queue = this.queue.concat(items);
                }

                if (!paused) { this.start(); }

                return this.size();
            };

            /**
             * clear() clears all items from the queue
             * and stops processing
             *
             * @return<Array> the original queue
             */
            this.clear = function() {
                var orig = this.queue;
                this.stop();
                this.queue = [];
                cleared = true;
                return orig;
            };

            /**
             * pause() pauses processing of the queue
             *
             */
            this.pause = function() {
                this.stop();
                paused = true;
            };

            /**
             * stop() stops processing of the queue
             *
             */
            this.stop = function() {
                if (timeoutProm) {
                    $timeout.cancel(timeoutProm);
                }

                timeoutProm = null;
            };

            /**
             * start() starts processing of the queue.
             * start() may be called after pause()
             *
             */
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

            /**
             * indexOf() returns the first index of the item in the queue
             *
             * @param<Object> item
             * @return<Number> index of the item if found, or -1 if not
             */
            this.indexOf = function(item) {
                if (this.queue.indexOf) return this.queue.indexOf(item);

                for (var i = 0; i < this.queue.length; i++) {
                    if (item === this.queue[i]) return i;
                }
                return -1;
            };
        }

        /**
         * queue() is a convenience function to return a new Queue
         *
         * Usage:
         *          TODO
         *
         * @param<Object> options
         * @return<Queue> a new Queue
         */
        Queue.queue = function(options) {
            return new Queue(options);
        };

        return Queue;
    }]);

})(window, window.angular);