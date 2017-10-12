const CalculatorInput = require("./contracts/CalculatorInput")
const {roundTo,percentageToDecimal} = require("./util")

function calculate(req, res){
    const input = new CalculatorInput(req.body)
  try {
    validate(input)
    const result = {
      TSFA: computeTSFA(input),
      RRSP: computeRRSP(input)
    }
    res.send(result)
  }catch(error){
      res.status(400).send(error.message)
  }
}

function compute(input, computeAfterTax, computeAmountTaxedOnWithdrawal){
  const nominalRateOfReturn = percentageToDecimal(input.investmentGrowthRate)
  const inflationRate = percentageToDecimal(input.inflationRate)
  const yearsInvested = input.yearsInvested

  const afterTax = computeAfterTax(input.amountInvested, percentageToDecimal(input.currentTaxRate))

  const rateOfReturn = (1 + nominalRateOfReturn) / (1 + inflationRate) -1;

  const futureValue = afterTax * Math.pow((1 + rateOfReturn), yearsInvested);

  const amountTaxedOnWithdrawal = computeAmountTaxedOnWithdrawal(futureValue,percentageToDecimal(input.retirementTaxRate))

  const afterTaxFutureValue = futureValue - amountTaxedOnWithdrawal

  return {
    afterTax: roundTo(afterTax, 2),
    futureValue: roundTo(futureValue, 2),
    amountTaxedOnWithdrawal: roundTo(amountTaxedOnWithdrawal,2),
    afterTaxFutureValue: roundTo(afterTaxFutureValue,2)
  }
}

function computeTSFA(input){
  return compute(input, function(amountInvested, currentTaxRate){
    return amountInvested * (1 - currentTaxRate)
  },
  function(){
    return 0
  })
}

function computeRRSP(input){
  return compute(input, function(amountInvested){
      return amountInvested
    },
    function(futureValue, retirementTaxRate){
      return futureValue * retirementTaxRate
    })
}

function validate(input){
  const validationErrors = []
  for(const field in input){
    const value = input[field]
    if(value === null){
      validationErrors.push({field: field, message: "is required."})
    }
    else {
      switch(field){
        case "currentTaxRate":
        case "retirementTaxRate":
        case "inflationRate":
        case "investmentGrowthRate":
          if(value < 0 || value > 100) {
            validationErrors.push({field: field, message: "must be a valid percentage (between 0 and 100)"})
          }
          break;
        case "amountInvested":
        case "yearsInvested":
          if(value < 0){
            validationErrors.push({field: field, message: "cannot be negative."})
          }
      }
    }
  }

  if(validationErrors.length > 0) throw new Error(JSON.stringify(validationErrors))

}


module.exports= {
  calculate: calculate,
  //these are exported for testing purposes; not because they should be generally shared.
  validate: validate,
  computeRRSP: computeRRSP,
  computeTSFA: computeTSFA
}




