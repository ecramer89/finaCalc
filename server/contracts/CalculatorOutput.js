export default class CalculatorOutput{
  /*
   @param {AccountResults} TSFA
   @param {AccountResults} RRSP
   @param {Array(string)=} metaData optional array of messages communicating information about the computed results.
   */
  constructor({TSFA, RRSP, metaData}){
     this.TSFA = TSFA ? new AccountResults(TSFA) : null,
     this.RRSP = RRSP ? new AccountResults(RRSP) : null
     this.metaData = metaData && Array.isArray(metaData)
      && metaData.reduce((allString, msg)=>allString&&typeof(msg) == 'string', true) ? metaData : []
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