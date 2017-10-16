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
      this.afterTax = Number.isFinite(afterTax) ? afterTax : "Too much to count."
      //since arguments come from server, can trust that if argument is Infinity or NaN it's because the number is too big
      //to support normal arithmetic (i.e., Infinity-infinity = NaN).
      //as opposed to calculator input, where values that fail the Number.isFinite check might just be invalid, since they
      //come from client.
      this.futureValue = Number.isFinite(futureValue) ? futureValue : "Too much to count."
      this.amountTaxedOnWithdrawal = Number.isFinite(amountTaxedOnWithdrawal) ? amountTaxedOnWithdrawal : "Too much to count."
      this.afterTaxFutureValue = Number.isFinite(afterTaxFutureValue) ? afterTaxFutureValue : "Too much to count."
  }
}
