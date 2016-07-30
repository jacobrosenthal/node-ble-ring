"use strict";

var NobleDevice = require('noble-device');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var chunk = require('lodash.chunk');

var commands = require('./commands');

var CONFIG_SERVICE_UUID = '1e374a10851e11e3b9e70002a5d5c51b';
var CONFIG_CHARACTERISTIC_UUID   = '1e374a11851e11e3b9e70002a5d5c51b';

var MOTION_SERVICE_UUID = '1e374a20851e11e3b9e70002a5d5c51b';
var MOTION_RAW_CHARACTERISTIC_UUID = '1e374a21851e11e3b9e70002a5d5c51b';
var MOTION_POINTS_CHARACTERISTIC_UUID = '1e374a22851e11e3b9e70002a5d5c51b';

var RING_SERVICE_UUID = '1e374a30851e11e3b9e70002a5d5c51b';
var RING_EVENT_CHARACTERISTIC_UUID  = '1e374a31851e11e3b9e70002a5d5c51b';
var RING_MODE_CHARACTERISTIC_UUID    = '1e374a32851e11e3b9e70002a5d5c51b';
var RING_FEEDBACK_CHARACTERISTIC_UUID   = '1e374a33851e11e3b9e70002a5d5c51b';

var Ring = function(peripheral) {
  NobleDevice.call(this, peripheral);
  EventEmitter.call(this);
};

Ring.SCAN_UUIDS = [RING_SERVICE_UUID];
util.inherits(Ring, EventEmitter);
NobleDevice.Util.inherits(Ring, NobleDevice);

Ring.prototype.notifyEvent = function(done)
{
  this.notifyCharacteristic(RING_SERVICE_UUID, RING_EVENT_CHARACTERISTIC_UUID, true, this._onReadEvent.bind(this), done);
}

Ring.prototype.unnotifyEvent = function(done) {
  this.notifyCharacteristic(RING_SERVICE_UUID, RING_EVENT_CHARACTERISTIC_UUID, false, this._onReadEvent.bind(this), done);
};

Ring.prototype._onReadEvent = function(data)
{
  if(data && data instanceof Buffer && data.length>0)
  {
    switch (data.readUInt8(0)) {
      // 0x01 long press? seems like long press takes you out of event(camera) mode back into home mode
      case 0x01:
        this.emit('longpress');
        break;

      // 0x02 seen on camera screen for a quick touch and relase, takes a picture
      case 0x02:
        this.emit('event');
        break;

      // 0x03 final release in home mode
      case 0x03:
        this.emit('touchup');
        break;

      // 0x05 unsolicited heartbeat?? needs no response as far as I can tell
      case 0x05:
        this.emit('heartbeat');
        break;

      // 0x0D first touch while in home mode
      case 0x0d:
        this.emit('touchdown');
        break;

      default:
        break;
    }
  }
};

Ring.prototype.readPoints = function(done)
{
  this.readDataCharacteristic(MOTION_SERVICE_UUID, MOTION_POINTS_CHARACTERISTIC_UUID, function(error, data){

    var toXY = function(dataArray) {
      var x = ["'x'"];
      var y = ["'y'"];
      for (var i = 0; i < dataArray.length; i++) {
        if(i%2){
          y.push(dataArray[i]);
        }else{
          x.push(dataArray[i]);
        }
      };
      return [x,y];
    }

    if(data && data instanceof Buffer){
      var dataArray = Array.prototype.slice.call(data, 0)
      var pairs = chunk(dataArray, 2);
      var xy = toXY(dataArray);
      return done(null, xy);
    }else
    {
      return done(error, data)
    }
  });
}

Ring.prototype.readRaw = function(done)
{
  this.readDataCharacteristic(MOTION_SERVICE_UUID, MOTION_RAW_CHARACTERISTIC_UUID, done);
}

Ring.prototype.setModeNormal = function(done)
{
  this.writeDataCharacteristic(RING_SERVICE_UUID, RING_MODE_CHARACTERISTIC_UUID, commands.MODE_NORMAL, done);
}

Ring.prototype.setModeQuaternion = function(done)
{
  this.writeDataCharacteristic(RING_SERVICE_UUID, RING_MODE_CHARACTERISTIC_UUID, commands.MODE_QUARTERNION, done);
}

Ring.prototype.setModeEvent = function(done)
{
  this.writeDataCharacteristic(RING_SERVICE_UUID, RING_MODE_CHARACTERISTIC_UUID, commands.MODE_EVENT, done);
}

Ring.prototype.setModeRestart = function(done)
{
  this.writeDataCharacteristic(RING_SERVICE_UUID, RING_MODE_CHARACTERISTIC_UUID, commands.MODE_RESTART, done);
}

Ring.prototype.setModeSleep = function(done)
{
  this.writeDataCharacteristic(RING_SERVICE_UUID, RING_MODE_CHARACTERISTIC_UUID, commands.MODE_SLEEP, done);
}

Ring.prototype.setFeedbackLedSuccess = function(done)
{
  this.writeDataCharacteristic(RING_SERVICE_UUID, RING_FEEDBACK_CHARACTERISTIC_UUID, commands.FEEDBACK_LED_SUCCESS, done);
}

Ring.prototype.setFeedbackLedFail = function(done)
{
  this.writeDataCharacteristic(RING_SERVICE_UUID, RING_FEEDBACK_CHARACTERISTIC_UUID, commands.FEEDBACK_LED_FAIL, done);
}

Ring.prototype.setFeedbackSoundSuccess = function(done)
{
  this.writeDataCharacteristic(RING_SERVICE_UUID, RING_FEEDBACK_CHARACTERISTIC_UUID, commands.FEEDBACK_SOUND_SUCCESS, done);
}

Ring.prototype.setFeedbackSoundFail = function(done)
{
  this.writeDataCharacteristic(RING_SERVICE_UUID, RING_FEEDBACK_CHARACTERISTIC_UUID, commands.FEEDBACK_SOUND_FAIL, done);
}

Ring.prototype.setFeedbackBothSuccess = function(done)
{
  this.writeDataCharacteristic(RING_SERVICE_UUID, RING_FEEDBACK_CHARACTERISTIC_UUID, commands.FEEDBACK_BOTH_SUCCESS, done);
}

Ring.prototype.setFeedbackBothFail = function(done)
{
  this.writeDataCharacteristic(RING_SERVICE_UUID, RING_FEEDBACK_CHARACTERISTIC_UUID, commands.FEEDBACK_BOTH_FAIL, done);
}
  
// export your device 
module.exports = Ring;
