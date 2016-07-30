"use strict";

var Ring = require('../');

Ring.discover(function(ring) {
 
  var errorCheck = function(error){
    if(error){
      console.log('bailing out! :( ', error);
      process.exit(0);
    }
  }

  ring.on('disconnect', function() {
    console.log('we got disconnected! :( ');
    process.exit(0);
  });


  ring.on('longpress', function(){

  });

  ring.on('event', function(){

  });

  ring.on('touchup', function(){
      ring.readPoints(function(error, array){
        console.log("read points", error)
        if(array){
          console.log('[', array[0].toString(),'],');
          console.log('[', array[1].toString(),']');
          ring.setFeedbackBothSuccess(errorCheck);
        }
      });
  });

  ring.on('heartbeat', function(){

  });

  ring.on('touchdown', function(){
    // 0x1 blink led once
    // 0x2 blink led twice
    // 0x3 beep (vibrate) once (not used in code?)
    // 0x4 beep (vibrate) twice  (not used in code?)
    // 0x5 beep (vibrate) and blink once
    // 0x6 beep (vibrate) and blink twice
    ring.setFeedbackBothSuccess(errorCheck);
  });

  ring.connectAndSetUp(function(err) {
    console.log('ready');
    //put into 'camera' mode, 
    // ring.setModeEvent(errorCheck);
    
    //start the events emitter
    ring.notifyEvent(errorCheck);
  });

});
