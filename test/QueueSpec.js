(function() {
    'use strict';

    describe('angular-queue', function() {

        var $queue,
            $timeout,
            myQueue,
            result,
            myCallback = function(item) {
                result.push(item);
            };

        beforeEach(function() {
            result = [];
            module('ngQueue');
            inject(function($injector) {
                $queue = $injector.get('$queue');
                $timeout = $injector.get('$timeout');
                myQueue = $queue.queue(myCallback);
            });
        });

        describe('Constructor', function() {
            it('Should throw exception when no callback is specified',
                function() {
                    expect($queue.queue).toThrow();
                }
            );

            it('Should make a new Queue', function() {
                var aQueue = $queue.queue(myCallback);
                expect(aQueue).toBeDefined();
                expect(aQueue.queue).toBeDefined();
            });
        });

        describe('#pause', function() {
            it('Should pause the queue', function() {
                myQueue.pause();
                expect(myQueue.paused).toBeTruthy();
            });
        });

        describe('#start', function() {
            it('Should unpause the queue', function() {
                myQueue.pause();
                expect(myQueue.paused).toBeTruthy();
                myQueue.start();
                expect(myQueue.paused).toBeFalsy();
            });
        });

        describe('#add', function() {
            it('Should add an item to the queue', function() {
                myQueue.pause();
                expect(myQueue.queue.length).toEqual(0);
                expect(myQueue.add('item')).toEqual(1);
                expect(myQueue.queue.length).toEqual(1);
                expect(myQueue.queue[0]).toEqual('item');
            });
        });

        describe('#size', function() {
            it('Should return the number of items in the queue', function() {
                myQueue.pause();
                expect(myQueue.size()).toEqual(0);
                myQueue.add('an item');
                expect(myQueue.size()).toEqual(1);
                myQueue.add('another item');
                expect(myQueue.size()).toEqual(2);
            });
        });

        describe('#addEach', function() {
            it('Should add an array of items to the queue', function() {
                myQueue.pause();
                myQueue.addEach(['tom', 'joe', 'mike']);
                expect(myQueue.size()).toEqual(3);
                expect(myQueue.queue[1]).toEqual('joe');
            });
        });

        describe('#clear', function() {
            it('Should clear the queue', function() {
                myQueue.pause();
                myQueue.add('item');
                myQueue.clear();
                expect(myQueue.size()).toEqual(0);
            });
        });

        describe('#instanceOf', function() {
            it('Should return the index of the item in the queue', function() {
                myQueue.pause();
                myQueue.addEach(['tom', 'joe', 'mike']);
                expect(myQueue.indexOf('tom')).toEqual(0);
                expect(myQueue.indexOf('joe')).toEqual(1);
                expect(myQueue.indexOf('mike')).toEqual(2);
                expect(myQueue.indexOf('invalid')).toEqual(-1);
            });
        });

        describe('Queue processing', function() {
            it('Should process items via the provided callback', function() {
                expect(result.length).toEqual(0);
                var names = ['james', 'tom', 'joe', 'mike', 'ryan'];
                myQueue.addEach(names);
                for (var i = 0; i < names.length; i++) {
                    //Must call flush once per delay
                    $timeout.flush();
                    //Result is pushed items via myCallback
                    expect(result[i]).toEqual(names[i]);
                }
            });

            it('Should call the complete callback when finished', function() {
                
                var hasCompleted = false,
                    onComplete = function() {
                        hasCompleted = true;
                    },
                    aQueue = $queue.queue(myCallback, {complete: onComplete});

                aQueue.add('item');
                $timeout.flush();
                expect(hasCompleted).toBeTruthy();
            });
        });


    });
})();