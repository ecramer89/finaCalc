function calculate(req, res){
    const input = new CalculatorInput(req.body)
  try {
    validate(input)
    const result = {
      TSFA: computeTSFA(input),
      RRSP: computeRRSP(input)
    }
    res.send(result)
  }catch(validationError){
      res.status().send(validationError)
  }
}

function compute(input, computeAfterTax, computeAfterTaxFutureValue){
  const investmentGrowthRate = input.investmentGrowthRate
  const inflationRate = input.inflationRate
  const yearsInvested = input.yearsInvested

  const afterTax = computeAfterTax(input.amountInvested, input.currentTaxRate) //todo define a "to decimal" operation in the contract class.
  //it should perform the same modifications to the inputs as do our contracts
  const rateOfReturn = (1 + investmentGrowthRate) / (1 + inflationRate) -1; //beware of math errors. may want to use some rounding logic?
  //check on therounding rules
  const futureValue = afterTax * Math.pow((1 + rateOfReturn/100), yearsInvested);
  const afterTaxFutureValue = computeAfterTaxFutureValue(futureValue,input.retirementTaxRate)

  return {
    afterTax: roundTo(afterTax, 2),
    futureValue: roundTo(futureValue, 2),
    afterTaxFutureValue: roundTo(afterTaxFutureValue,2)
  }
}

function computeTSFA(input){
  return compute(input, function(amountInvested, currentTaxRate){
    return amountInvested * (1 - currentTaxRate/100)
  },
  function(futureValue){
    return futureValue
  })
}

function computeRRSP(input){
  return compute(input, function(amountInvested){
      return amountInvested
    },
    function(futureValue, retirementTaxRate){
      return futureValue * (1 - retirementTaxRate/100)
    })
}

function validate(){
  //check iffields null; if fields are numeric values, if fields are decimals within expected rate, etc.
  var validationErrors = []
  //validate each field
}


//todo this class should convert percentage inputs to decimal. NO ROUNDING until end
class CalculatorInput{
  constructor(data){
    this.currentTaxRate = data.currentTaxRate || null
    this.amountInvested = data.amountInvested || null
    this.retirementTaxRate = data.retirementTaxRate || null
    this.investmentGrowthRate = data.investmentGrowthRate || null
    this.inflationRate = data.inflationRate || null
    this.yearsInvested = data.yearsInvested || null
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





 */
