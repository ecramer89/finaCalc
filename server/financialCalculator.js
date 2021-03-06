import CalculatorInput from "./contracts/CalculatorInput"
import CalculatorOutput from "./contracts/CalculatorOutput"
import {roundTo} from "./util"

export function handler(req, res){
  try {
    const result = calculate(new CalculatorInput(req.body))
    res.send(result)
  }catch(error){
      res.status(400).send(error.message)
  }
}

/*
  @param {CalculatorInput} input
  @return {CalculatorOutput}
  throws error if validation on calculatorInput fails.
 */
export function calculate(calculatorInput){
  validate(calculatorInput)
  const TSFA = computeTSFA(calculatorInput)
  const RRSP = computeRRSP(calculatorInput)
  return new CalculatorOutput({
    TSFA,
    RRSP,
    betterAccount: determineBetterAccount(TSFA.afterTaxFutureValue, RRSP.afterTaxFutureValue, calculatorInput)
  })
}

/*
@param {CalculatorInput} input
 throws error if validation on calculatorInput fails.
 */
function validate(input){
  const validationErrors = []
  for(const field in input){
    if(!input.hasOwnProperty(field)) continue; //only interested in fields defined on CalculatorInput class.
    const value = input[field]
    if(value === null){ //strict check on null because 0 is acceptable value.
      validationErrors.push({field, message: "is required and must be a number."})
    }
    else {
      switch(field){
        case "currentTaxRate":
          if(value === 100) {
            validationErrors.push({field, message: "cannot be 100% because then you would have no after-tax to invest in the TSFA."})
          }
          if(Math.abs(value) > 100) {
            validationErrors.push({field, message: "cannot exceed 100."})
          }
          break;
        case "retirementTaxRate":
        case "inflationRate":
        case "investmentGrowthRate":
          if(Math.abs(value) > 100) { //since 'deflation', tax benefits, can result in negative rates, negatives are permissable and must check that abs. value doesn't exceed 100.
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
 @return {AccountResults}
 */
export function computeTSFA(input){
  return composeResults(
    input,
    (amountInvested)=>amountInvested, //TSFA deposits made with after-tax dollars, so net cost is just the amount the user invests
    ()=>0, //TSFA withdrawals are not taxed, so the tax on withdrawal is just 0.
    (futureValue)=>futureValue //future value after tax is just future value
  )


}

/*
 @param {CalculatorInput} input
 @return {AccountResults}
 */
export function computeRRSP(input){

  return composeResults(
    input,
    (amountInvested, taxRate)=>taxRate < 0 ? amountInvested : amountInvested/(1-taxRate), //for the comparison to work, need to equate the -net cost to user- of depositing to the TSFA and RRSP. Because the net cost to user for the TSFA deposit equals the amount invested,
    //need to adjust amount deposited into RRSP so that (taking the deducted refund into account) the net out of pocket cost to user equals the TSFA deposit.
    /*
    (small justification for why this value- the required after tax RRSP deposit- equals amountInvested/(1-taxRate))
     RRSPNetCost(amountInvested) = afterTaxDeposit - taxRate*afterTaxDeposit (since they receive the refund on the deposit)
     want RRSPNetCost(amountInvested) = TSFANetCost(amountInvested) = amountInvested (from the input field)
     substituting "afterTaxDeposit" for amountInvested/(1-taxRate):

     amountInvested/(1-taxRate) - amountInvested/(1-taxRate)*taxRate =
     amountInvested - amountInvested*taxRate/(1-taxRate) =
     amountInvested(1-taxRate)/(1-taxRate) =
     amountInvested =
     TSFANetCost(amountInvested)

     Conditional is there because, if the user has a negative tax rate (and is receiving supplemental payment from government)
     then there is no tax refund to correct for, for RRSP deposit after tax can just equal amount invested.
     */
    (amount, taxRate)=>amount * taxRate, //RRSP withdrawals are taxed according to the retirement tax rate,
    (futureValue,amountTaxedOnWithdrawal, retirementTaxRate)=>{
      return Number.isFinite(futureValue) ? //then amount taxed on withdrawal must also be finite.
        futureValue - amountTaxedOnWithdrawal : //otherwise future value is infinite.
        (retirementTaxRate == 100 ? 0 : Number.POSITIVE_INFINITY)
    })
}

/*
 @param {CalculatorInput} calculatorInput
 @param {number} RRSPFutureValueAfterTax
 @param {number}
 @param {number}
 @return {string} name of the account that would yield better result based on future value after tax or 'either' if they yield the same return.
 */
function determineBetterAccount(TSFAFutureValueAfterTax, RRSPFutureValueAfterTax, calculatorInput){
  const {retirementTaxRate,currentTaxRate} = calculatorInput
  //because of possible inconsistencies in comparison of unrounded tax rates and in computed after tax future values that show
  //up on client, would generally prefer to decide this on basis of computed after tax future values.
  //only if both after tax future values are infinity should we default to the raw inputted tax rates.
  if(TSFAFutureValueAfterTax == Number.POSITIVE_INFINITY && RRSPFutureValueAfterTax == Number.POSITIVE_INFINITY){
    const taxRateComparison = retirementTaxRate - currentTaxRate
    if(taxRateComparison === 0) return "either"
    if(taxRateComparison < 0) return "RRSP"
    return "TSFA"
  }
  //JS can't handle big numbers so just converts them all to positive infinity at some point.
  //strictly speaking, even if both account after tax future value are positive infinity, we can still infer which should yield better value
  //based on the difference in the tax rates on deposit and withdrawal.
  if(TSFAFutureValueAfterTax === RRSPFutureValueAfterTax) return "either"
  if(TSFAFutureValueAfterTax === Number.POSITIVE_INFINITY || TSFAFutureValueAfterTax > RRSPFutureValueAfterTax) return "TSFA"
  return "RRSP"
}

/*


 (futureValue,amountTaxedOnWithdrawal, retirementTaxRate)=>{
 return Number.isFinite(futureValue) ? //then amount taxed on withdrawal must also be finite.
 futureValue - amountTaxedOnWithdrawal : //otherwise future value is infinite.
 (retirementTaxRate == 100 ? 0 : Number.POSITIVE_INFINITY)
 }
 */
//if (and only if) future value is infinite,
//then any amount taxed > 0 will equal infinity as well.
//reason that if the tax rate is in (0, 100) the amount left over should be infinity.
//if tax rate is 100%, amount left over should be 0.
//0 times infinity is undefined, so must handle this case separately.

/*
 @param {CalculatorInput} input
 @param {function(number, number)=>number} computeAfterTax -> a function that returns the 'after tax' deposited into account given the net cost of investment to user and the user's current tax rate.
 @param {function(number, number)=>number} computeAmountTaxedOnWithdrawal -> a function that computes the amount taxed on the withdrawn investment given the investment future value and estimated tax rate on withdrawal
 @return {AccountResults}
 */
export function composeResults(input, computeAfterTax, computeAmountTaxedOnWithdrawal, computeFutureValueAfterTax){
  const nominalRateOfReturn = input.investmentGrowthRate/100
  const inflationRate = input.inflationRate/100

  const afterTax = computeAfterTax(input.amountInvested, input.currentTaxRate/100)

  const rateOfReturn = computeRealRateOfReturn(nominalRateOfReturn, inflationRate)

  const futureValue = computeFutureValue(afterTax, rateOfReturn, input.yearsInvested)

  const amountTaxedOnWithdrawal = computeAmountTaxedOnWithdrawal(futureValue,input.retirementTaxRate/100)

  const afterTaxFutureValue = computeFutureValueAfterTax(futureValue,amountTaxedOnWithdrawal, input.retirementTaxRate)

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











