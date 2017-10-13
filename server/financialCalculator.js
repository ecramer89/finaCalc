import CalculatorInput from "./contracts/CalculatorInput"
import {roundTo,percentageToDecimal} from "./util"

export function handler(req, res){
  try {
    const result = calculate(new CalculatorInput(req.body))
    res.send(result)
  }catch(error){
      res.status(400).send(error.message)
  }
}


export function calculate(calculatorInput){
  validate(calculatorInput)
  return {
    TSFA: computeTSFA(calculatorInput),
    RRSP: computeRRSP(calculatorInput)
  }
}

export function computeRealRateOfReturn(nominalRateOfReturn,inflationRate){
  return ((1 + nominalRateOfReturn) / (1 + inflationRate)) -1;
}


export function computeFutureValue(afterTax,rateOfReturn,yearsInvested){
  return afterTax * Math.pow((1 + rateOfReturn), yearsInvested);
}

export function composeComputations(input, computeAfterTax, computeAmountTaxedOnWithdrawal){
  const nominalRateOfReturn = percentageToDecimal(input.investmentGrowthRate)
  const inflationRate = percentageToDecimal(input.inflationRate)
  const yearsInvested = input.yearsInvested

  const afterTax = computeAfterTax(input.amountInvested, percentageToDecimal(input.currentTaxRate))

  const rateOfReturn = computeRealRateOfReturn(nominalRateOfReturn, inflationRate)

  const futureValue = computeFutureValue(afterTax, rateOfReturn, yearsInvested)

  const amountTaxedOnWithdrawal = computeAmountTaxedOnWithdrawal(futureValue,percentageToDecimal(input.retirementTaxRate))

  const afterTaxFutureValue = futureValue - amountTaxedOnWithdrawal

  return {
    afterTax: roundTo(afterTax, 2),
    futureValue: roundTo(futureValue, 2),
    amountTaxedOnWithdrawal: roundTo(amountTaxedOnWithdrawal,2),
    afterTaxFutureValue: roundTo(afterTaxFutureValue,2)
  }
}

export function deductTaxFromAmount(amount, taxRate){
  return amount * (1 - taxRate)
}

export function computeTaxDeducted(amount, taxRate){
  return amount * taxRate
}

export function computeTSFA(input){
  return composeComputations(input, deductTaxFromAmount, ()=>0)
}

export function computeRRSP(input){
  return composeComputations(input, (amountInvested)=>amountInvested, computeTaxDeducted)
}

export function validate(input){
  const validationErrors = []
  for(const field in input){
    const value = input[field]
    if(value === null){ //strict check on null because 0 is allowed.
      validationErrors.push({field, message: "is required."})
    }
    else {
      switch(field){
        case "currentTaxRate":
        case "retirementTaxRate":
        case "inflationRate":
        case "investmentGrowthRate":
          if(value < 0 || value > 100) {
            validationErrors.push({field, message: "cannot exceed 100."})
          }
          break;
        case "amountInvested":
        case "yearsInvested":
          if(value < 0){
            validationErrors.push({field, message: "cannot be negative."})
          }
      }
    }
  }

  if(validationErrors.length > 0) throw new Error(JSON.stringify(validationErrors))

}






