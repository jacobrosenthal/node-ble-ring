/*jslint node: true */
"use strict";

var NobleDevice = require('noble-device');

var RingZero = require('./lib/ring');

NobleDevice.Util.mixin(RingZero, NobleDevice.DeviceInformationService);

module.exports = RingZero;
