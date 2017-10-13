/*attempts to parse a valid number from input and returns the number or null if no number can be parsed*/
export function toNumber(value){
  if(typeof(value) === "string"){
    value=value.replace(/\s+|,|^\$|\$$|%$|^%/g, "")
    value = value.match("^(-?\\d*\\.?\\d*)$")
  }
  const asNumber = Number.parseFloat(value)
  return Number.isFinite(asNumber) ? asNumber : null
}

/*I researched and learned about the exponentiation technique for correctly rounding numbers in Javascript from this blog post:
 * http://www.jacklmoore.com/notes/rounding-in-javascript/
 * REQUIRES: places >= 0
*/
export function roundTo(value, places){
  if(places < 0) return value;
  return Number(Math.round(value+'e'+places)+'e-'+places)
}

//converts a number representing a percentage to a decimal.
//if the input does not represent a number, returns null
export function percentageToDecimal(percentage){
  percentage = toNumber(percentage)
  if(percentage === null) return null
  return percentage/100;
}

