/*attempts to parse a valid number from input and returns the number or null if no number can be parsed*/
export function toNumber(value){
  if(typeof(value) === "string"){
    value=value.replace(/\s+|,|^\$|\$$|%$|^%/g, "") //accept $ or % in valid positions, as well as commas or spaces (both treated as delimiters).
    //strip these valid characters from input to make the regex checker easier to write.
    value = value.match("^(-?\\d*\\.?\\d*)$") //after removing valid non numeric characters, does the string represent a valid number?
  }
  const asNumber = Number.parseFloat(value)
  return Number.isFinite(asNumber) ? asNumber : null
}

/* rounds value ti given places
 * REQUIRES: places >= 0
*/
export function roundTo(value, places){
  if(places < 0) return value;
  const multiple = Math.pow(10,places)
  return Math.round(value*multiple)/multiple
}

//converts a number representing a percentage to a decimal.
//if the input does not represent a number, returns null
export function percentageToDecimal(percentage){
  percentage = toNumber(percentage)
  if(percentage === null) return null
  return percentage/100;
}

