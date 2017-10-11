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

  const afterTax = computeAfterTax(input.amountInvested, input.currentTaxRate) //todo define a "to decimal" operation in the contract class.

  const rateOfReturn = (1 + investmentGrowthRate) / (1 + inflationRate) -1; //beware of math errors. may want to use some rounding logic?

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
    if(!value){
      validationErrors.push({field: field, message: field+" is required."})
    }
    else {
      switch(field){
        case "currentTaxRate":
        case "retirementTaxRate":
        case "inflationRate":
        case "investmentGrowthRate":
          if(value < 0 || value > 100) {
            validationErrors.push({field: field, message: field+" must be a valid percentage (between 0 and 100)"})
          }
          break;
        case "amountInvested":
        case "yearsInvested":
          if(value < 0){
            validationErrors.push({field: field, message: field+" cannot be negative."})
          }
      }
    }
  }

  if(validationErrors.length > 0) throw new Error(JSON.stringify(validationErrors))

}


function toNumber(value){
  const asNumber = Number.parseFloat(value)
  return Number.isFinite(asNumber) ? asNumber : null

}


class CalculatorInput{
  constructor(data){
    this.currentTaxRate = toNumber(data.currentTaxRate);
    this.amountInvested = toNumber(data.amountInvested)
    this.retirementTaxRate = toNumber(data.retirementTaxRate);
    this.investmentGrowthRate = toNumber(data.investmentGrowthRate);
    this.inflationRate = toNumber(data.inflationRate);
    this.yearsInvested = toNumber(data.yearsInvested)

  }
}

function roundTo(value, places){
  const shift = Math.pow(10, places)
  return Math.floor(value * shift) / shift;
}


module.exports = calculate;



/*
  QUESTIONS TO ASK:
  -clarification on the "after tax" thing
  -clarify that the interest is compounded yearly
  -clarify about rounding
  -clarify whether user is expedcted to input all of the form values?
  -cannot open the hyperlinked pageto "today's dollars"; not sure what this implies
  -do we assume that users will be withdrawing when they retire? (vs the time years invested+today)
  -should we compute the inflation rate ourselves? (i.e. the client an estimate the current time or could attempt to retrieve current inflation rate from an external service)





 */
