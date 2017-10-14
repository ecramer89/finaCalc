import CalculatorInput from "./contracts/CalculatorInput"
import CalculatorOutput from "./contracts/CalculatorOutput"
import {roundTo} from "./util"

export function handler(req, res){
  try {
    const result = calculate(new CalculatorInput(req.body))
    res.send(result) //may cause an error if we iterate over-- a class?
  }catch(error){
      res.status(400).send(error.message)
  }
}

/*
  @param {CalculatorInput} input
 */
export function calculate(calculatorInput){
  validate(calculatorInput)
  return new CalculatorOutput({
    TSFA: computeTSFA(calculatorInput),
    RRSP: computeRRSP(calculatorInput)
  })
}

/*
@param {CalculatorInput} input
 */
function validate(input){
  const validationErrors = []
  for(const field in input){
    if(!input.hasOwnProperty(field)) continue; //only interested in fields defined on CalculatorInput class.
    const value = input[field]
    if(value === null){ //strict check on null because 0 is allowed.
      validationErrors.push({field, message: "is required and must be a number."})
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

/*
 @param {CalculatorInput} input
 */
export function computeTSFA(input){
  return composeResults(input, (amountInvested)=>amountInvested, ()=>0)
}

/*
 @param {CalculatorInput} input
 */
export function computeRRSP(input){
  return composeResults(input,
    (amountInvested, taxRate)=>amountInvested/(1-taxRate),
    (amount, taxRate)=>amount * taxRate)
}

/*
 @param {CalculatorInput} input
 @param {function(number, number)=>number} computeAfterTax
 @param {function(number, number)=>number} computeAmountTaxedOnWithdrawal
 */
export function composeResults(input, computeAfterTax, computeAmountTaxedOnWithdrawal){
  const nominalRateOfReturn = input.investmentGrowthRate/100
  const inflationRate = input.inflationRate/100

  const afterTax = computeAfterTax(input.amountInvested, input.currentTaxRate/100)

  const rateOfReturn = computeRealRateOfReturn(nominalRateOfReturn, inflationRate)

  const futureValue = computeFutureValue(afterTax, rateOfReturn, input.yearsInvested)

  const amountTaxedOnWithdrawal = computeAmountTaxedOnWithdrawal(futureValue,input.retirementTaxRate/100)

  const afterTaxFutureValue = futureValue - amountTaxedOnWithdrawal

  //all computations done internally on unrounded values; results rounded at end for reporting to user at end of investment period.
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









