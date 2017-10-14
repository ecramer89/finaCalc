export default class CalculatorOutput{
  /*
   @param {TSFA} AccountResults
   @param {RRSP} AccountResults
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
    this.afterTax = Number.isFinite(afterTax) ? afterTax : null,
      this.futureValue = Number.isFinite(futureValue) ? futureValue : null,
      this.amountTaxedOnWithdrawal = Number.isFinite(amountTaxedOnWithdrawal) ? amountTaxedOnWithdrawal : null,
      this.afterTaxFutureValue = Number.isFinite(afterTaxFutureValue) ? afterTaxFutureValue : null
  }
}