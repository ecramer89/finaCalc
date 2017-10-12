const CalculatorInput = require("./contracts/CalculatorInput")
const {roundTo} = require("./util")

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
  const investmentGrowthRate = input.investmentGrowthRate
  const inflationRate = input.inflationRate
  const yearsInvested = input.yearsInvested

  const afterTax = computeAfterTax(input.amountInvested, input.currentTaxRate)

  //should they be expressed as rates or as percentages when used to compute the result?
  const rateOfReturn = (1 + investmentGrowthRate) / (1 + inflationRate) -1;

  const futureValue = afterTax * Math.pow((1 + rateOfReturn/100), yearsInvested);
  const amountTaxedOnWithdrawal = computeAmountTaxedOnWithdrawal(futureValue,input.retirementTaxRate)
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
    return amountInvested * (1 - currentTaxRate/100)
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
      return futureValue * retirementTaxRate/100
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




