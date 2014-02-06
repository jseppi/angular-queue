(function(){
    'use strict';

    describe('angular-queue', function() {

        var $queue,
            $timeout,
            myQueue,
            result,
            myCallback = function(item) {
                //console.log('Callback: ', item);
                result.push(item);
            };

        beforeEach(function() {
            result = [];
            module('ngQueue');
            inject(function($injector) {
                $queue = $injector.get('$queue');
                $timeout = $injector.get('$timeout');
                myQueue = $queue.queue({
                    callback: myCallback
                });
            });
        });

        describe('#queue', function() {
            it('Should throw exception when no callback is specified',
                function() {
                    expect($queue.queue).toThrow();
                }
            );

            it('Should make a new Queue', function() {
                var aQueue = $queue.queue({callback: myCallback});
                expect(aQueue).not.toBe(null);
            });
        });

        it('should work', function() {

            var names = ['james', 'tom', 'joe', 'mike', 'ryan'];
            myQueue.addEach(names);
            for (var i = 0; i < names.length; i++) {
                //Must call flush once per delay
                $timeout.flush();
            }

            expect(result.length).toEqual(5);

            // myQueue.add('james');
            // myQueue.add('tom');
            // myQueue.add('taylor');
            // myQueue.add('patrick');
            // myQueue.add('joe');
            // for (var j = 0; j < names.length; j++) {
            //     $timeout.flush();
            // }
        });
    });
})();