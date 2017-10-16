export default class CalculatorOutput{
  /*
   @param {AccountResults} TSFA
   @param {AccountResults} RRSP
   @param {string} betterAccount
   */
  constructor({TSFA, RRSP}){
     this.TSFA = TSFA ? new AccountResults(TSFA) : null,
     this.RRSP = RRSP ? new AccountResults(RRSP) : null
     this.betterAccount = determineBetterAccount(this.TSFA.afterTaxFutureValue, this.RRSP.afterTaxFutureValue)
  }
}

const BIG_NUMBER="Too big to count"

export class AccountResults{
  /*
   @param {number} afterTax
   @param {number} futureValue
   @param {number} amountTaxedOnWithdrawal
   @param {number} afterTaxFutureValue
   */
  constructor({afterTax,futureValue,amountTaxedOnWithdrawal,afterTaxFutureValue}){
      //arguments come from server, so don't require input checking.
      //substitute Number.POSITIVE_INFINITY for string "Infinity" because
      //Number.POSITIVE_INFINITY becomes 'null' when it hits the client.
      this.afterTax = Number.isFinite(afterTax)? afterTax : BIG_NUMBER
      this.futureValue = Number.isFinite(futureValue) ? futureValue : BIG_NUMBER
      this.amountTaxedOnWithdrawal = Number.isFinite(amountTaxedOnWithdrawal) ? amountTaxedOnWithdrawal : BIG_NUMBER
      this.afterTaxFutureValue = Number.isFinite(afterTaxFutureValue) ? afterTaxFutureValue : BIG_NUMBER
  }
}

function determineBetterAccount(TSFAFutureValue, RRSPFutureValue){
  if(TSFAFutureValue === RRSPFutureValue) return "either"
  if(TSFAFutureValue === BIG_NUMBER || TSFAFutureValue > RRSPFutureValue) return "TSFA"
  return "RRSP"
}
