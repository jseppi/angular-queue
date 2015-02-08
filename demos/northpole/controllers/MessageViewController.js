'use strict';

angular.module('northpole.controllers').controller('MessageViewController',  
  ['$rootScope', 
    '$scope', 
    '$queue',
    function ($rootScope, 
              $scope, 
              $queue) {

	    var systemMessageQueue = null; 	

	    $scope.init = function(){

	    	createSystemMessageQueue(); 	

	    	addPart("Body", 1000);
	    	addPart("Head", 5000);
	    	addPart("Arms", 2000);
	    	addPart("Legs", 200);
	    	addPart("Paint", 4000);
	    	addPart("Eyes", 1000);
	    }

	  	var addPart = function( partNameStr, timeMilliseconds ) {

	  		var messageStr = "Adding " + partNameStr + " / Time: " + String ( timeMilliseconds / 1000 ) + " seconds"; 

	  		showSystemMessage( messageStr, timeMilliseconds ); 
	  	} 	
		
		// MESSAGE 

	    var createSystemMessageQueue = function(){

	        var queueCallback = function(messsageObj) {      
	          console.log("MessageQueue callback messsage: ", messsageObj);

	          messsageObj.showMessage(); 
	          messsageObj.closeMessage(); 

	        };

	        var options = {
	                delay: 2000, //delay 2 seconds between processing items
	                paused: true, //start out paused
	                complete: function() { console.log('complete!'); 

	                	$scope.toymodel.message = "Santa?! Where's the blue fairy? Wah wah...demo done!";

	            }
	        };

	        // create an instance of a queue
	        // note that the first argument - a callback to be used on each item - is required
	        systemMessageQueue = $queue.queue(queueCallback, options);

	        systemMessageQueue.start(); //must call start() if queue starts paused

	    }  


	    var showSystemMessage = function( messageStr, timeMilliseconds ){

	      var closeMessage = function(){

	      	systemMessageQueue.pause();
	        
	          setTimeout( function(){
		       $scope.toymodel.message = "Part Complete!";

		       systemMessageQueue.start();

		      }, timeMilliseconds);

	      }

	      var showMessage = function(){
	       	
	      	$scope.toymodel.message = messageStr;
	        
	      }


	      var messageObj = {
	        messageStr: messageStr,
	        timeMilliseconds: timeMilliseconds,
	        showMessage: showMessage,
	        closeMessage: closeMessage,
	      }

	      systemMessageQueue.add( messageObj ) 
	      
	    }


}]);
