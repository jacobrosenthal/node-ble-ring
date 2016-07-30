/*jslint node: true */
"use strict";

module.exports = {

    MODE_NORMAL                   : new Buffer([0x01]),
    MODE_QUARTERNION              : new Buffer([0x02]),
    MODE_EVENT                    : new Buffer([0x04]),
    MODE_RESTART                  : new Buffer([0x05]),
    MODE_SLEEP                    : new Buffer([0x00]),

    FEEDBACK_LED_SUCCESS          : new Buffer([0x01]),
    FEEDBACK_LED_FAIL             : new Buffer([0x02]),
    FEEDBACK_SOUND_SUCCESS        : new Buffer([0x03]),
    FEEDBACK_SOUND_FAIL           : new Buffer([0x04]),
    FEEDBACK_BOTH_SUCCESS         : new Buffer([0x05]),
    FEEDBACK_BOTH_FAIL            : new Buffer([0x06]),

};