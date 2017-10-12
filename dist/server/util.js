'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toNumber = toNumber;
exports.roundTo = roundTo;
exports.percentageToDecimal = percentageToDecimal;
/*attempts to parse a valid number from input and returns the number or null if no number can be parsed*/
function toNumber(value) {
  var asNumber = Number.parseFloat(value);
  return Number.isFinite(asNumber) ? asNumber : null;
}

/*I researched and learned about the exponentiation technique for correctly rounding numbers in Javascript from this blog post:
 * http://www.jacklmoore.com/notes/rounding-in-javascript/
 * REQUIRES: places >= 0
*/
function roundTo(value, places) {
  if (places < 0) return value;
  return Number(Math.round(value + 'e' + places) + 'e-' + places);
}

//converts a number representing a percentage to a decimal.
//if the input does not represent a number, returns null
function percentageToDecimal(percentage) {
  percentage = toNumber(percentage);
  if (percentage === null) return null;
  return percentage / 100;
}