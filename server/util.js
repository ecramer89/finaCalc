function toNumber(value){
  const asNumber = Number.parseFloat(value)
  return Number.isFinite(asNumber) ? asNumber : null
}

function roundTo(value, places){
  const shift = Math.pow(10, places)
  return Math.floor(value * shift) / shift;
}

module.exports= {
  toNumber: toNumber,
  roundTo: roundTo
}