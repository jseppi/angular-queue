# angular-queue

Asynchronous queue processing for [AngularJS](http://angularjs.org/).

Based on http://benalman.com/code/projects/jquery-message-queuing/docs/files/jquery-ba-jqmq-js.html

## Usage

Include `angular-queue.js` after your main AngularJS script.

Specify `ngQueue` as a dependency for your Angular application:
    
    var app = angular.module('myApp', ['ngQueue']);
    
In your controller, services, etc, inject `$queue`, and create an instance to use:

    app.controller("MyCtrl", ['$queue',
        function($queue){
            var myCallback = function(item) {
                    console.log(item);
                },
                options = {
                    delay: 2000, //delay 2 seconds between processing items
                    paused: true, //start out paused
                    complete: function() { console.log('complete!'); }
                },
                myQueue = $queue.queue(myCallback, options);
                
            myQueue.add('item 1'); //add one item
            myQueue.addEach(['item 2', 'item 3']); //add multiple items
            
            myQueue.start(); //must call start() if queue starts paused
        }]
    );


## License

[MIT](http://jseppi.mit-license.org)
