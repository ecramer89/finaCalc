export function toNumber(value){
  const asNumber = Number.parseFloat(value)
  return Number.isFinite(asNumber) ? asNumber : null
}

export function roundTo(value, places){
  const shift = Math.pow(10, places)
  return Math.floor(value * shift) / shift;
}

export function percentageToDecimal(percentage){
  return percentage/100;
}

