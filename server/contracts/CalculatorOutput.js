export default class CalculatorOutput{
  /*
   @param {AccountResults} TSFA
   @param {AccountResults} RRSP
   */
  constructor({TSFA, RRSP}){
     this.TSFA = TSFA ? new AccountResults(TSFA) : null,
     this.RRSP = RRSP ? new AccountResults(RRSP) : null
  }
}

export class AccountResults{
  /*
   @param {number} afterTax
   @param {number} futureValue
   @param {number} amountTaxedOnWithdrawal
   @param {number} afterTaxFutureValue
   */
  constructor({afterTax,futureValue,amountTaxedOnWithdrawal,afterTaxFutureValue}){
      this.afterTax = checkAndHandleInfinity(afterTax)
      this.futureValue = checkAndHandleInfinity(futureValue)
      this.amountTaxedOnWithdrawal = checkAndHandleInfinity(amountTaxedOnWithdrawal)
      this.afterTaxFutureValue = checkAndHandleInfinity(afterTaxFutureValue)
  }
}

function checkAndHandleInfinity(output){
  return output == 'Infinity' ? "Too much to count." : Number.isFinite(output) ? output : null
}