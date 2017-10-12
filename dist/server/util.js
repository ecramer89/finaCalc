"use strict";

function toNumber(value) {
  var asNumber = Number.parseFloat(value);
  return Number.isFinite(asNumber) ? asNumber : null;
}

function roundTo(value, places) {
  var shift = Math.pow(10, places);
  return Math.floor(value * shift) / shift;
}

function percentageToDecimal(percentage) {
  return percentage / 100;
}

module.exports = {
  toNumber: toNumber,
  roundTo: roundTo,
  percentageToDecimal: percentageToDecimal
};