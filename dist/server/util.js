"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toNumber = toNumber;
exports.roundTo = roundTo;
exports.percentageToDecimal = percentageToDecimal;
/*attempts to parse a valid number from input and returns the number or null if no number can be parsed*/
function toNumber(value) {
  if (typeof value === "string") {
    value = value.replace(/\s+|,|^\$|\$$|%$|^%/g, ""); //accept $ or % in valid positions, as well as commas or spaces (both treated as delimiters).
    //strip these valid characters from input to make the regex checker easier to write.
    value = value.match("^(-?\\d*\\.?\\d*)$"); //after removing valid non numeric characters, does the string represent a valid number?
  }
  var asNumber = Number.parseFloat(value);
  return Number.isFinite(asNumber) ? asNumber : null;
}

/*I researched and learned about the exponentiation technique for correctly rounding numbers in Javascript from this blog post:
 * http://www.jacklmoore.com/notes/rounding-in-javascript/
 * this is necessary because native JS doesn't have a function to round to places and other techniques (such as multiplying/flooring/dividing by 100 or using "toFixed"
 * don't round up; they always floor to the nearest integer.
 * as such, values such as 5.6789 rounded to two would become 5.67 instead of 5.68.
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