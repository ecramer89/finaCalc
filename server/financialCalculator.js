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

function validate(input){
  const validationErrors = []
  for(const field in input){
    if(!input.hasOwnProperty(field)) continue; //only interested in fields defined on CalculatorInput class.
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
          if(Math.abs(value) > 100) {
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

export function computeTSFA(input){
  return composeResults(input, deductTaxFromAmount, ()=>0)
}

export function computeRRSP(input){
  return composeResults(input, (amountInvested)=>amountInvested, computeTaxDeducted)
}

export function composeResults(input, computeAfterTax, computeAmountTaxedOnWithdrawal){
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
/*
 * @param {number} nominalRateOfReturn expressed as a decimal.
 * @param {number} inflationRate expressed as a decimal.
 * */
export function computeRealRateOfReturn(nominalRateOfReturn,inflationRate){
  return ((1 + nominalRateOfReturn) / (1 + inflationRate)) -1;
}

/*
 * @param {number} taxRate expressed as a decimal.
 * @param {number} rateOfReturn expressed as a decimal
 * @param {number} years investment period in years.
 * */
export function computeFutureValue(afterTax,rateOfReturn,yearsInvested){
  return afterTax * Math.pow((1 + rateOfReturn), yearsInvested);
}

/*returns the 'afterTax' value of amount, applying given tax rate
* @param {number} amount amout of money
* @param {number} taxRate expressed as a decimal.
* */
export function deductTaxFromAmount(amount, taxRate){
  return amount * (1 - taxRate)
}

/*return the amount of tax that would have to be paid on amount, given taxRate
 * @param {number} amount amount of money
 * @param {number} taxRate expressed as a decimal.
 * */
export function computeTaxDeducted(amount, taxRate){
  return amount * taxRate
}








